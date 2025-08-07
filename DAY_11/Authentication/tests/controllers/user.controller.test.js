jest.setTimeout(50000); // Set Jest timeout to 30 seconds

const mongoose = require('mongoose');
const userController = require('../../controllers/user.controller');
const httpMocks = require('node-mocks-http');
const User = require('../../models/user.model');

beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/Authentication');

  //await mongoose.connect('mongodb://localhost:27017/Authentication');
});

afterAll(async () => {
  await mongoose.connection.close();
});

// before every test case clear the database
beforeEach(async () => {
  await User.deleteMany({});// Deletes all documents in the User collection
});

describe('User Controller', () => {
  test('should register a new user', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      },
    });

    const res = httpMocks.createResponse();

    await userController.registerUser(req, res);

    expect(res.statusCode).toBe(201);
    const data = res._getJSONData();
    expect(data.message).toBe('User registered successfully');
  });
});

