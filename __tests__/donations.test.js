const request = require('supertest');
const express = require('express');

const Donations = require('../api/donations/donationModel');
const DonationsRouter = require('../api/donations/donationRouter');

const server = express();
server.use(express.json());

jest.mock('../api/donations/donationModel.js');

// Mock the auth middleware completely -- Skip over it.
jest.mock('../api/middleware/authRequired.js', () =>
  jest.fn((req, res, next) => next())
);

describe('Donation Endpoints', () => {
  beforeAll(() => {
    server.use(['/donation', '/donations'], DonationsRouter);
    jest.clearAllMocks();
  });

  describe('GET /', () => {
    it('should return 200', async () => {
      Donations.getAllDonations.mockResolvedValue([]);
      const response = await request(server).get('/donations');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(0);
      expect(Donations.getAllDonations.mock.calls.length).toBe(1);
    });
  });

  describe('GET /:id', () => {
    it('should return 200 when donation was found', async () => {
      const structure = {
        id: 'd22b9b36-f699-5f46-bd01-6918772b4f39',
        user_id: 'd22b9b36-f699-4f46-bd01-6918772b4f59',
        amount: '15.00',
      };

      Donations.findDonationByID.mockResolvedValue(structure);
      const response = await request(server).get(
        '/donations/d22b9b36-f699-5f46-bd01-6918772b4f39'
      );

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(structure);
    });

    it('should return 404 when donation not found', async () => {
      Donations.findDonationByID.mockResolvedValue();
      const response = await request(server).get(
        '/donations/d22b3b36-f699-4f46-bd01-6918772b4f54'
      );

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('DonationNotFound');
    });
  });

  describe('POST /', () => {
    it('should return 200 when donation is created', async () => {
      const structure = {
        user_id: 'd22b9b36-f699-4f46-bd01-6918772b4f59',
        amount: '15.00',
      };

      Donations.findDonationByID.mockResolvedValue(undefined);
      Donations.createDonation.mockResolvedValue([
        Object.assign(
          { id: 'd22b9b36-f699-5f46-bd01-6918772b4f39' },
          structure
        ),
      ]);
      const response = await request(server)
        .post('/donations')
        .send(structure);

      expect(response.status).toBe(200);
      expect(response.body.donation.id).toBe(
        'd22b9b36-f699-5f46-bd01-6918772b4f39'
      );
      expect(Donations.createDonation.mock.calls.length).toBe(1);
    });
  });
});
