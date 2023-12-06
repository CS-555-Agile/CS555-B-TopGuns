const request = require('supertest');
const app = require('./app'); 

describe('Login Route Tests', () => {
  
  it('should return 200 ', async () => {
    const response = await request(app)
      .get('/login')
      

    expect(response.status).toBe(200);
    
  });
  it('should return 400 since only one field passed', async () => {
    const response = await request(app)
      .post('/login')
      .send({ emailInput: 'testdev@gmail.com' });

      expect(response.status === 400).toBe(true);
    
  });
  it('should return 302 or 200 and a success message for valid login', async () => {
    const response = await request(app)
      .post('/login')
      .send({ emailInput: 'testdev@gmail.com', passwordInput: '1911194@Sweet' });

      expect(response.status === 302 || response.status === 200).toBe(true);
    
  });

  it('should return 400 and an error message for invalid login', async () => {
    const response = await request(app)
      .post('/login')
      .send({ emailInput: 'testuser', passwordInput: 'wrongpassword' });

    expect(response.status).toBe(400);
    
  });
  
  
});

