const request = require('supertest');
const server = require('../api/app');

describe('index router endpoints', () => {
  beforeAll(() => {});

  describe('GET /', () => {
    // Ensure that the index `/` endpoint displays up message.
    it('should return json with api:up', async () => {
      const res = await request(server).get('/');

      expect(res.status).toBe(200);
      expect(res.body.api).toBe('up');
    });
  });
});
