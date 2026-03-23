const request = require('supertest');
const app = require('../index');

describe('Auth Endpoints', () => {
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('user');
  });

  it('should login an existing user', async () => {
    // Register first
    await request(app).post('/api/v1/auth/register').send({
      username: 'testuser2',
      email: 'testuser2@example.com',
      password: 'password123'
    });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'testuser2',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('accessToken');
  });
});
