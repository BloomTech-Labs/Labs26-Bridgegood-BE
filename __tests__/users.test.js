const request = require('supertest');
const express = require('express');

const Users = require('../api/users/userModel');
const UsersRouter = require('../api/users/userRouter');
const singleUserRoute = require('../api/users/singleUserRoute');

const server = express();
server.use(express.json());

jest.mock('../api/users/userModel.js');
// Mock the auth middleware completely -- Skip over it.
jest.mock('../api/middleware/authRequired.js', () =>
  jest.fn((req, res, next) => {
    req.user = 'llama001@maildrop.cc';
    next();
  })
);

describe('User Endpoints', () => {
  beforeAll(() => {
    server.use(['/user'], singleUserRoute);
    server.use(['/users'], UsersRouter);
    jest.clearAllMocks();
  });

  describe('GET / - Single User', () => {
    it('should return 200', async () => {
      const user = {
        id: 'd22b9b36-f699-4f46-bd01-6918772b4f59',
        first_name: 'Alexander',
        last_name: 'Besse',
        school: 'Lambda School',
        bg_username: 'Alexander-Besse',
        email: 'llama001@maildrop.cc',
        phone: '(468) 807-4643',
        role_id: 2,
      };
      Users.findUserByFilter.mockResolvedValue([user]);
      Users.findOrCreateUserBy.mockResolvedValue([user]);
      const response = await request(server).get('/user');
      expect(response.status).toBe(200);
      expect(response.body.user).toMatchObject(user);
    });
  });

  describe('GET /', () => {
    it('should return 200', async () => {
      Users.getAllUsers.mockResolvedValue([]);
      const response = await request(server).get('/users');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(0);
      expect(Users.getAllUsers.mock.calls.length).toBe(1);
    });
  });

  describe('GET /:id', () => {
    it('should return 200 when user was found', async () => {
      const structure = {
        id: 'd22b9b36-f699-4f46-bd01-6918772b4f59',
        first_name: 'Alexander',
        last_name: 'Besse',
        school: 'Lambda School',
        bg_username: 'Alexander-Besse',
        email: 'llama001@maildrop.cc',
        phone: '(468) 807-4643',
        role_id: 2,
      };

      Users.findUserByID.mockResolvedValue(structure);
      const response = await request(server).get(
        '/users/d22b9b36-f699-4f46-bd01-6918772b4f59'
      );

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(structure);
    });

    it('should return 404 when user not found', async () => {
      Users.findUserByID.mockResolvedValue();
      const response = await request(server).get(
        '/users/d22b9b36-f699-4f46-bd01-6918772b4f52'
      );

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('UserNotFound');
    });
  });

  describe('POST /', () => {
    it('should return 200 when user is created', async () => {
      const user = {
        id: 'd22b9b36-f699-4f46-bd01-6918772b4f59',
        first_name: 'Alexander',
        last_name: 'Besse',
        school: 'Lambda School',
        profile_url: 'somesite.com',
        bg_username: 'Alexander-Besse',
        email: 'llama001@maildrop.cc',
        phone: '(468) 807-4643',
        role_id: 2,
        demerits: 0,
        praises: 0,
        user_rating: 0,
        isLocked: false,
      };
      Users.findOrCreateUserBy.mockResolvedValue(user);
      const response = await request(server).post('/users').send(user);
      expect(response.status).toBe(201);
      expect(response.body.user).toMatchObject(user);
    });
  });

  describe('PUT /:id', () => {
    it('should return 200 when user is updated', async () => {
      const user = {
        id: 'd22b9b36-f699-4f46-bd01-6918772b4f52',
        name: 'John Smith',
      };
      Users.findUserByID.mockResolvedValue(user);
      Users.updateUser.mockResolvedValue([user]);

      const response = await request(server).put('/users').send(user);

      expect(response.status).toBe(200);
      expect(response.body.user.name).toBe('John Smith');
      expect(Users.updateUser.mock.calls.length).toBe(1);
    });
  });

  describe('DELETE /:id', () => {
    it('should return 200 when user is deleted ', async () => {
      Users.removeUser.mockResolvedValue(
        'd22b9b36-f699-4f46-bd01-6918772b4f52'
      );
      const response = await request(server).delete(
        '/users/d22b9b36-f699-4f46-bd01-6918772b4f52'
      );

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "User 'd22b9b36-f699-4f46-bd01-6918772b4f52' was deleted."
      );
    });
  });
});
