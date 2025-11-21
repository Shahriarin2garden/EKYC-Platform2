const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const logger = require('./config/logger');
const connectDB = require('./config/database');
const pdfWorker = require('./services/pdfWorker');

// Load environment variables
dotenv.config();

// Create Express app first
const app = express();

// Track service availability
let servicesReady = {
  database: false,
  pdfWorker: false,
  serverStarted: false
};

// Global error handlers - less aggressive to keep server running
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION!', { error: err.name, message: err.message, stack: err.stack });
  // Don't exit - try to keep server running
});

process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION!', { error: err.name, message: err.message, stack: err.stack });
  // Don't exit - let the app handle it
});

// Connect to MongoDB (async but non-blocking)
// Server will start even if this fails
setTimeout(async () => {
  try {
    logger.info('Attempting to connect to MongoDB...');
    await connectDB();
    servicesReady.database = true;
    logger.info('✅ MongoDB connected successfully');
  } catch (err) {
    logger.error('❌ Failed to connect to MongoDB', { error: err.message });
    logger.warn('⚠️  Server will continue without database. API endpoints may not work.');
  }
}, 1000);

// Start PDF Worker (RabbitMQ consumer) - Only if RabbitMQ URL is configured
// Server will start even if this fails
if (process.env.RABBITMQ_URL) {
  setTimeout(async () => {
    try {
      logger.info('Attempting to start PDF Worker...');
      await pdfWorker.startPdfWorker();
      servicesReady.pdfWorker = true;
      logger.info('✅ PDF Worker started successfully');
    } catch (err) {
      logger.error('❌ Failed to start PDF Worker', { error: err.message });
      logger.warn('⚠️  PDF generation via queue will not be available.');
    }
  }, 2000);
} else {
  logger.warn('⚠️  RABBITMQ_URL not configured. PDF Worker disabled.');
}

// Import routes
const kycRoutes = require('./routes/kycRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Middleware
// Configure CORS - Allow all origins for now since we're having issues
const corsOptions = {
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // Cache preflight for 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable preflight for all routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, { 
    ip: req.ip, 
    origin: req.get('origin'),
    userAgent: req.get('user-agent')
  });
  next();
});

// Health check route - Railway needs this to pass health checks
app.get('/api/health', (req, res) => {
  logger.info('Health check requested');
  res.status(200).json({ 
    status: 'success', 
    message: 'EKYC API Server is running',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 5000,
    services: {
      server: servicesReady.serverStarted,
      database: servicesReady.database,
      pdfWorker: servicesReady.pdfWorker
    }
  });
});

// Root health check for Railway - CRITICAL for deployment
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    service: 'EKYC Backend API',
    version: '1.0.0',
    uptime: process.uptime(),
    services: servicesReady
  });
});

// Explicit OPTIONS handler for CORS preflight
app.options('/api/*', (req, res) => {
  res.status(204).send();
});

// API Routes with error boundary
try {
  app.use('/api/kyc', kycRoutes);
  app.use('/api/admin', adminRoutes);
} catch (err) {
  logger.error('Route initialization error', { error: err.message });
}

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Internal server error', { 
    error: err.message, 
    stack: err.stack, 
    path: req.path,
    method: req.method,
    body: req.body
  });
  
  // Don't leak error details in production
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = Number.parseInt(process.env.PORT, 10) || 5000;
const HOST = '0.0.0.0';

logger.info(`Starting server with PORT=${PORT}, HOST=${HOST}`);
logger.info(`Environment variables: PORT=${process.env.PORT}, NODE_ENV=${process.env.NODE_ENV}`);

// Add error handling for server startup
const server = app.listen(PORT, HOST, () => {
  servicesReady.serverStarted = true;
  logger.info('='.repeat(60));
  logger.info(`✅ EKYC API Server successfully started`);
  logger.info(`🌐 Listening on ${HOST}:${PORT}`);
  logger.info(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  logger.info(`📊 MongoDB: ${process.env.MONGODB_URI ? 'Configured' : 'Not configured'}`);
  logger.info(`📄 PDF Worker: ${process.env.RABBITMQ_URL ? 'Enabled' : 'Disabled'}`);
  logger.info('='.repeat(60));
  logger.info('🚀 Server is ready to accept requests!');
}).on('error', (err) => {
  logger.error('❌ Server failed to start', { error: err.message, port: PORT, code: err.code });
  if (err.code === 'EADDRINUSE') {
    logger.error(`Port ${PORT} is already in use`);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server and PDF Worker');
  server.close(() => {
    logger.info('HTTP server closed');
    pdfWorker.stopPdfWorker().then(() => {
      logger.info('PDF Worker stopped');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server and PDF Worker');
  server.close(() => {
    logger.info('HTTP server closed');
    pdfWorker.stopPdfWorker().then(() => {
      logger.info('PDF Worker stopped');
      process.exit(0);
    });
  });
});

module.exports = app;
