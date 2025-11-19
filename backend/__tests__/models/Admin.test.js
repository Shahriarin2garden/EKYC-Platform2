const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Admin = require('../../src/models/Admin');

let mongoServer;

describe('Admin Model Tests', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Admin.deleteMany({});
  });

  describe('Admin Creation', () => {
    test('should create a valid admin', async () => {
      const validAdmin = {
        name: 'Test Admin',
        email: 'test@admin.com',
        password: 'password123'
      };

      const admin = await Admin.create(validAdmin);

      expect(admin._id).toBeDefined();
      expect(admin.name).toBe(validAdmin.name);
      expect(admin.email).toBe(validAdmin.email);
      expect(admin.password).not.toBe(validAdmin.password);
      expect(admin.role).toBe('admin');
      expect(admin.isActive).toBe(true);
    });

    test('should fail to create admin without required fields', async () => {
      const invalidAdmin = {
        name: 'Test Admin'
      };

      await expect(Admin.create(invalidAdmin)).rejects.toThrow();
    });
  });

  describe('Password Hashing', () => {
    test('should hash password before saving', async () => {
      const plainPassword = 'password123';
      const admin = await Admin.create({
        name: 'Test Admin',
        email: 'test@admin.com',
        password: plainPassword
      });

      expect(admin.password).not.toBe(plainPassword);
      expect(admin.password.length).toBeGreaterThan(plainPassword.length);
    });
  });

  describe('JWT Token Generation', () => {
    test('should generate a valid JWT token', async () => {
      const admin = await Admin.create({
        name: 'Test Admin',
        email: 'test@admin.com',
        password: 'password123'
      });

      const token = admin.generateAuthToken();

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3);
    });
  });
});
