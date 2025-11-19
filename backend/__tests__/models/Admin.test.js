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
      expect(admin.password).not.toBe(validAdmin.password); // Should be hashed
      expect(admin.role).toBe('admin'); // Default role
      expect(admin.isActive).toBe(true);
    });

    test('should fail to create admin without required fields', async () => {
      const invalidAdmin = {
        name: 'Test Admin'
      };

      await expect(Admin.create(invalidAdmin)).rejects.toThrow();
    });

    test('should fail to create admin with invalid email', async () => {
      const invalidAdmin = {
        name: 'Test Admin',
        email: 'invalid-email',
        password: 'password123'
      };

      await expect(Admin.create(invalidAdmin)).rejects.toThrow();
    });

    test('should fail to create admin with short password', async () => {
      const invalidAdmin = {
        name: 'Test Admin',
        email: 'test@admin.com',
        password: 'short'
      };

      await expect(Admin.create(invalidAdmin)).rejects.toThrow();
    });

    test('should not allow duplicate emails', async () => {
      const adminData = {
        name: 'Test Admin',
        email: 'test@admin.com',
        password: 'password123'
      };

      await Admin.create(adminData);
      await expect(Admin.create(adminData)).rejects.toThrow();
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

    test('should not rehash password if not modified', async () => {
      const admin = await Admin.create({
        name: 'Test Admin',
        email: 'test@admin.com',
        password: 'password123'
      });

      const originalPassword = admin.password;
      admin.name = 'Updated Name';
      await admin.save();

      expect(admin.password).toBe(originalPassword);
    });
  });

  describe('Password Comparison', () => {
    test('should correctly compare passwords', async () => {
      const plainPassword = 'password123';
      const admin = await Admin.create({
        name: 'Test Admin',
        email: 'test@admin.com',
        password: plainPassword
      });

      const isMatch = await admin.comparePassword(plainPassword);
      expect(isMatch).toBe(true);
    });

    test('should return false for incorrect password', async () => {
      const admin = await Admin.create({
        name: 'Test Admin',
        email: 'test@admin.com',
        password: 'password123'
      });

      const isMatch = await admin.comparePassword('wrongpassword');
      expect(isMatch).toBe(false);
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
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });
  });

  describe('Find By Credentials', () => {
    test('should find admin with valid credentials', async () => {
      const credentials = {
        email: 'test@admin.com',
        password: 'password123'
      };

      await Admin.create({
        name: 'Test Admin',
        ...credentials
      });

      const admin = await Admin.findByCredentials(credentials.email, credentials.password);
      expect(admin).toBeDefined();
      expect(admin.email).toBe(credentials.email);
    });

    test('should reject invalid email', async () => {
      await Admin.create({
        name: 'Test Admin',
        email: 'test@admin.com',
        password: 'password123'
      });

      await expect(
        Admin.findByCredentials('wrong@email.com', 'password123')
      ).rejects.toThrow('Invalid email or password');
    });

    test('should reject invalid password', async () => {
      await Admin.create({
        name: 'Test Admin',
        email: 'test@admin.com',
        password: 'password123'
      });

      await expect(
        Admin.findByCredentials('test@admin.com', 'wrongpassword')
      ).rejects.toThrow('Invalid email or password');
    });

    test('should not find inactive admin', async () => {
      const admin = await Admin.create({
        name: 'Test Admin',
        email: 'test@admin.com',
        password: 'password123',
        isActive: false
      });

      await expect(
        Admin.findByCredentials(admin.email, 'password123')
      ).rejects.toThrow('Invalid email or password');
    });
  });

  describe('Update Last Login', () => {
    test('should update last login timestamp', async () => {
      const admin = await Admin.create({
        name: 'Test Admin',
        email: 'test@admin.com',
        password: 'password123'
      });

      expect(admin.lastLogin).toBeUndefined();

      await admin.updateLastLogin();
      
      expect(admin.lastLogin).toBeDefined();
      expect(admin.lastLogin).toBeInstanceOf(Date);
    });
  });
});
