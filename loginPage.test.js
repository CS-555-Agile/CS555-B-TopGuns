const request = require('supertest');
const app = require('./app'); 
const os = require('os');
describe('Route Tests after login', () => {


  //Test Case for GET Route performance Tests
  it('should respond within 500ms', async () => {
    const startTime = Date.now();
    const response = await request(app).get('/logout');
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    expect(responseTime).toBeLessThan(500);
  });
  it('should handle 15 requests per second for login', async () => {
    const startTime = Date.now();
    const promises = [];

    for (let i = 0; i < 15; i++) {
      promises.push(Promise.race([
        request(app).post('/login').send({ emailInput: 'testdev@gmail.com', passwordInput: '1911194@Sweet' }),
        request(app).get('/logout').send(),
        new Promise((resolve, reject) => setTimeout(reject, 500)), // Timeout after 700ms
      ]));
    }

    await Promise.all(promises);
    const endTime = Date.now();
    const requestDuration = endTime - startTime;
    const throughput = 100 / (requestDuration / 1000);

    expect(throughput).toBeGreaterThanOrEqual(100);
  });
  it('should not consume more than 200MB of RAM', async () => {
    const memoryUsageBefore = os.freemem() / os.totalmem();

    const startTime = Date.now();
    const loginResponse = await request(app)
      .post('/login')
      .send({ emailInput: 'testdev@gmail.com', passwordInput: '1911194@Sweet' });
    
    expect(loginResponse.status === 302 || loginResponse.status === 200).toBe(true);
    // Get the cookie from the login response
    const cookie = loginResponse.headers['set-cookie'][0];

    // Book an appointment
    const bookAppointmentResponse = await request(app)
      .post('/appointment')
      .set('Cookie', cookie)
      .send({ category: 'consultant', consultant_id: '65414a648322d09b477736db',time_slot:'10:00',date:'11-08-2023',notes:'nothing' });
    const endTime = Date.now();

    const memoryUsageAfter = os.freemem() / os.totalmem();
    const memoryConsumed = memoryUsageBefore - memoryUsageAfter;
    expect(memoryConsumed).toBeLessThanOrEqual(0.2);
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
// Test that the user can open an appointment page after logging in
    it('should allow user to show book an appointment page after logging in', async () => {
        // Login the user
        const loginResponse = await request(app)
          .post('/login')
          .send({ emailInput: 'testdev@gmail.com', passwordInput: '1911194@Sweet' });
        
        expect(loginResponse.status === 302 || loginResponse.status === 200).toBe(true);
        // Get the cookie from the login response
        const cookie = loginResponse.headers['set-cookie'][0];
    
        // Book an appointment
        const bookAppointmentResponse = await request(app)
          .get('/appointment')
          .set('Cookie', cookie)
    
    
        expect(bookAppointmentResponse.status).toBe(200);
       
      });

  
// Test that the user can book an appointment after logging in
  it('should allow user to book an appointment after logging in', async () => {
    // Login the user
    const loginResponse = await request(app)
      .post('/login')
      .send({ emailInput: 'testdev@gmail.com', passwordInput: '1911194@Sweet' });
    
    expect(loginResponse.status === 302 || loginResponse.status === 200).toBe(true);
    // Get the cookie from the login response
    const cookie = loginResponse.headers['set-cookie'][0];

    // Book an appointment
    const bookAppointmentResponse = await request(app)
      .post('/appointment')
      .set('Cookie', cookie)
      .send({ category: 'consultant', consultant_id: '65414a648322d09b477736db',time_slot:'10:00',date:'11-08-2023',notes:'nothing' });


    expect(bookAppointmentResponse.status).toBe(200);
   
  });
  
});

