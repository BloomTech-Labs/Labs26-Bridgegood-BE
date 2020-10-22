const request = require('supertest');
const express = require('express');

const Reservations = require('../api/reservations/reservationModel');
const ReservationsRouter = require('../api/reservations/reservationRouter');

const server = express();
server.use(express.json());

jest.mock('../api/reservations/reservationModel.js');

// Mock the auth middleware completely -- Skip over it.
jest.mock('../api/middleware/authRequired.js', () =>
  jest.fn((req, res, next) => {
    req.user = 'llama001@maildrop.cc';
    next();
  })
);

describe('Reservation Endpoints', () => {
  beforeAll(() => {
    server.use(['/reservation', '/reservations'], ReservationsRouter);
    jest.clearAllMocks();
  });

  describe('GET /', () => {
    it('should return 200', async () => {
      Reservations.getAllReservations.mockResolvedValue([]);
      const response = await request(server).get('/reservations');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(0);
      expect(Reservations.getAllReservations.mock.calls.length).toBe(1);
    });
  });

  describe('GET /:id', () => {
    it('should return 200 when reservation was found', async () => {
      const structure = {
        id: 'd22b9b36-f699-4f46-bd01-6918772b4f59',
        datetime: '09022020:1000',
        duration: '1h',
        user_id: '57e747fc-a0d0-44af-a9ee-1b90e083a88b',
        room_id: 'da3024b3-ad0d-4bda-b45b-7fcf129ab08a',
      };

      Reservations.findReservationByID.mockResolvedValue(structure);
      const response = await request(server).get(
        '/reservations/d22b9b36-f699-4f46-bd01-6918772b4f59'
      );

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(structure);
    });

    it('should return 404 when reservation not found', async () => {
      Reservations.findReservationByID.mockResolvedValue();
      const response = await request(server).get(
        '/reservation/d22b9b36-f699-4f46-bd01-6918772b4f54'
      );

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Reservation Not Found');
    });
  });

  describe('POST /', () => {
    it('should return 200 when reservation is created', async () => {
      const structure = {
        datetime: '09022020:1000',
        duration: '1h',
        user_id: '57e747fc-a0d0-44af-a9ee-1b90e083a88b',
        room_id: 'da3024b3-ad0d-4bda-b45b-7fcf129ab08a',
      };

      Reservations.findReservationByID.mockResolvedValue(undefined);
      Reservations.createReservation.mockResolvedValue([
        Object.assign(
          { id: '36b7210f-9fb1-4941-a3f1-7672df561665' },
          structure
        ),
      ]);
      const response = await request(server)
        .post('/reservations')
        .send(structure);

      expect(response.status).toBe(201);
      expect(response.body.reservation.id).toBe(
        '36b7210f-9fb1-4941-a3f1-7672df561665'
      );
      expect(Reservations.createReservation.mock.calls.length).toBe(1);
    });
  });

  describe('PUT /:id', () => {
    it('should return 200 when reservation is updated', async () => {
      const structure = {
        id: '36b7210f-9fb1-4941-a3f1-7672df561665',
        duration: '2h',
      };
      Reservations.findReservationByID.mockResolvedValue(structure);
      Reservations.updateReservation.mockResolvedValue([structure]);

      const response = await request(server)
        .put('/reservations')
        .send(structure);

      expect(response.status).toBe(200);
      expect(response.body.reservation.duration).toBe('2h');
      expect(Reservations.updateReservation.mock.calls.length).toBe(1);
    });
  });

  describe('DELETE /:id', () => {
    it('should return 200 when reservation is deleted ', async () => {
      Reservations.removeReservation.mockResolvedValue(
        '36b7210f-9fb1-4941-a3f1-7672df561665'
      );
      const response = await request(server).delete(
        '/reservation/36b7210f-9fb1-4941-a3f1-7672df561665'
      );

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "Reservation '36b7210f-9fb1-4941-a3f1-7672df561665' was deleted."
      );
    });
  });
});
