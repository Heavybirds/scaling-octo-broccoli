const request = require('supertest');
const { app } = require('../index');

describe('Private Jet Ecosystem Platform API', () => {
  
  describe('Health Check', () => {
    it('should return healthy status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'healthy');
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('Flight Tracker', () => {
    it('should get all flights', async () => {
      const res = await request(app).get('/api/flights');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('flights');
      expect(Array.isArray(res.body.flights)).toBe(true);
      expect(res.body).toHaveProperty('free', true);
      expect(res.body).toHaveProperty('ads', false);
    });
  });

  describe('Authentication', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: `test${Date.now()}@example.com`,
          password: 'testpass123',
          name: 'Test User',
          role: 'broker'
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('role', 'broker');
    });
  });

  describe('Financing', () => {
    it('should calculate financing estimate', async () => {
      const res = await request(app)
        .post('/api/financing/estimate')
        .send({
          aircraftPrice: 5000000,
          downPayment: 1000000,
          interestRate: 5.5,
          loanTerm: 10,
          creditScore: 750
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('estimate');
      expect(res.body.estimate).toHaveProperty('monthlyPayment');
      expect(res.body.estimate).toHaveProperty('totalInterest');
    });
  });

  describe('Scheduling', () => {
    it('should create an appointment', async () => {
      const res = await request(app)
        .post('/api/scheduling')
        .send({
          title: 'Test Meeting',
          startTime: '2025-11-14T14:00:00Z',
          timezone: 'America/New_York'
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('appointment');
      expect(res.body.appointment).toHaveProperty('title', 'Test Meeting');
    });
  });

  describe('Workflow', () => {
    it('should create a workflow', async () => {
      const res = await request(app)
        .post('/api/workflow')
        .send({
          title: 'Test Workflow',
          description: 'Test workflow description',
          steps: [
            { title: 'Step 1', description: 'First step' }
          ]
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('workflow');
      expect(res.body.workflow).toHaveProperty('title', 'Test Workflow');
    });
  });
});
