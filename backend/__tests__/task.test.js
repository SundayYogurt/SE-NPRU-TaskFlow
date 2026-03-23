const request = require('supertest');
const app = require('../index');

describe('Task Endpoints', () => {
  let token;
  let taskId;

  beforeAll(async () => {
    // register and login a user to get token
    await request(app).post('/api/v1/auth/register').send({
      username: 'taskuser',
      email: 'taskuser@example.com',
      password: 'password123'
    });
    const res = await request(app).post('/api/v1/auth/login').send({
      username: 'taskuser',
      password: 'password123'
    });
    token = res.body.accessToken;
  });

  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Task',
        description: 'Test Description'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.task).toHaveProperty('title', 'Test Task');
    taskId = res.body.task._id;
  });

  it('should get all tasks', async () => {
    const res = await request(app)
      .get('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.tasks.length).toBeGreaterThan(0);
  });
  
  it('should update a task', async () => {
    const res = await request(app)
      .put(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'inprogress'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.task).toHaveProperty('status', 'inprogress');
  });

  it('should delete a task', async () => {
    const res = await request(app)
      .delete(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });
});
