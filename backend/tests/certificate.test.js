const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Certificate = require('../models/Certificate');
const User = require('../models/User');

describe('Certificate API', () => {
  let adminToken;
  let adminUser;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/certifyx-test');
    
    // Create admin user
    adminUser = new User({
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin',
      name: 'Test Admin',
      walletAddress: '0x123'
    });
    await adminUser.save();

    // Login to get token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'password123'
      });
    
    adminToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await Certificate.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/certificates/issue', () => {
    it('should issue a certificate successfully', async () => {
      const certificateData = {
        learnerAddress: '0x456',
        learnerName: 'John Doe',
        qualification: 'Web Development',
        institution: 'Tech Institute'
      };

      const response = await request(app)
        .post('/api/certificates/issue')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(certificateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.certificate).toBeDefined();
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/certificates/issue')
        .send({});

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/certificates/verify/:adminAddress/:certificateId', () => {
    it('should verify a valid certificate', async () => {
      // First create a certificate
      const certificate = new Certificate({
        certificateId: 1,
        learnerAddress: '0x456',
        learnerName: 'John Doe',
        qualification: 'Web Development',
        institution: 'Tech Institute',
        adminAddress: '0x123',
        transactionHash: '0xabc123'
      });
      await certificate.save();

      const response = await request(app)
        .get('/api/certificates/verify/0x123/1');

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/certificates/analytics', () => {
    it('should return analytics for admin', async () => {
      const response = await request(app)
        .get('/api/certificates/analytics')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.totalIssued).toBeDefined();
      expect(response.body.totalVerified).toBeDefined();
    });
  });
});