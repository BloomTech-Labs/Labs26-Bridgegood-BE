const express = require('express');
const authRequired = require('../middleware/authRequired');
const Reservations = require('./reservationModel');
const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Reservation:
 *      type: object
 *      required:
 *        - id
 *        - datetime
 *        - duration
 *        - user_id
 *        - room_id
 *      properties:
 *        id:
 *          type: string
 *          description: UUID of the reservation.
 *        datetime:
 *          type: string
 *          description: The date:time of the starting time.
 *        duration:
 *          type: string
 *          description: Duration of the reservation.
 *        user_id:
 *          type: number
 *          description: ID of the user making the reservation.
 *        room_id:
 *          type: number
 *          description: ID of the room being reserved.
 *        donation_id:
 *          type: string
 *          description: Foreign key to a donation, if user donated during reservation. Defaults to null if donation was not made.
 *      example:
 *        datetime: '09122020:1000'
 *        duration: '1hr'
 *        user_id: 1
 *        room_id: 2
 *        donation_id: 'd43167f1-f711-4dbb-b550-8f473d059105'
 *
 * /reservations:
 *  get:
 *    description: Returns a list of all reservations.
 *    summary: Get a list of all reservations.
 *    security:
 *      - okta: []
 *    tags:
 *      - Reservations
 *    responses:
 *      200:
 *        description: Successful response with a list of reservations.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Reservation'
 *              example:
 *                - datetime: '09122020:1000'
 *                  duration: '1hr'
 *                  user_id: 1
 *                  room_id: 2
 *                  donation_id: 'd43167f1-f711-4dbb-b550-8f473d059105'
 *                - datetime: '09102020:1100'
 *                  duration: '1hr'
 *                  user_id: 2
 *                  room_id: 1
 *                  donation_id: null
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', authRequired, function (req, res) {
  Reservations.getAllReservations()
    .then((resv) => {
      res.status(200).json(resv);
    })
    .catch(({ message }) => {
      res.status(500).json({ message });
    });
});

/**
 * @swagger
 * components:
 *  parameters:
 *    reservationid:
 *      name: id
 *      in: path
 *      description: ID of the reservation to return.
 *      required: true
 *      example: 1
 *      schema:
 *        type: string
 *
 * /reservations/{id}:
 *  get:
 *    description: Find reservation by ID
 *    summary: Returns a single reservation by ID.
 *    security:
 *      - okta: []
 *    tags:
 *      - Reservations
 *    parameters:
 *      - $ref: '#/components/parameters/reservationid'
 *    responses:
 *      200:
 *        description: Successful response, returns a singular reservation.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Reservation'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 */
router.get('/:id', authRequired, function (req, res) {
  const id = String(req.params.id);
  Reservations.findReservationByID(id)
    .then((reservation) => {
      if (reservation) {
        res.status(200).json(reservation);
      } else {
        res.status(404).json({ error: 'Reservation Not Found' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

/**
 * @swagger
 * /reservations:
 *  post:
 *    summary: Add a reservation.
 *    security:
 *      - okta: []
 *    tags:
 *      - Reservations
 *    requestBody:
 *      description: An object with the details about the reservation. See required information for base structure.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Reservation'
 *    responses:
 *      400:
 *        $ref: '#/components/responses/BadRequest'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      200:
 *        description: Reservation successfully created and added.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message about request's result.
 *                  example: Reservation successfully created and added.
 *                reservation:
 *                  $ref: '#/components/schemas/Reservation'
 */
router.post('/', authRequired, async (req, res) => {
  const reservation = req.body;
  if (reservation) {
    const id = reservation.id || 0;
    try {
      await Reservations.findReservationByID(id).then(async (usr) => {
        if (usr == undefined) {
          // Reservation not found so lets insert it
          await Reservations.createReservation(reservation).then(
            (reservation) =>
              res.status(200).json({
                message: 'Reservation successfully created.',
                reservation: reservation[0],
              })
          );
        } else {
          res.status(400).json({ message: 'Reservation already exists.' });
        }
      });
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  } else {
    res
      .status(404)
      .json({ message: 'There was a problem creating the reservation. (404)' });
  }
});

/**
 * @swagger
 * /reservations:
 *  put:
 *    summary: Update a reservation.
 *    security:
 *      - okta: []
 *    tags:
 *      - Reservations
 *    requestBody:
 *      description: Object containing the information to update.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Reservation'
 *    responses:
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      200:
 *        description: The updated reservation.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message about request's result.
 *                  example: Reservation successfully updated.
 *                reservation:
 *                  $ref: '#/components/schemas/Reservation'
 */
router.put('/', authRequired, (req, res) => {
  const reservation = req.body;
  if (reservation) {
    const id = reservation.id || 0;
    Reservations.findReservationByID(id)
      .then(
        Reservations.updateReservation(id, reservation)
          .then((updated) => {
            res.status(200).json({
              message: 'Reservation updated.',
              reservation: updated[0],
            });
          })
          .catch((err) => {
            res.status(500).json({
              message: `Could not update reservation: '${id}'`,
              error: err.message,
            });
          })
      )
      .catch((err) => {
        res.status(404).json({
          message: `Could not find reservation '${id}'`,
          error: err.message,
        });
      });
  }
});
/**
 * @swagger
 * /reservations/{id}:
 *  delete:
 *    summary: Remove a reservation.
 *    security:
 *      - okta: []
 *    tags:
 *      - Reservations
 *    parameters:
 *      - $ref: '#/components/parameters/reservationid'
 *    responses:
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      200:
 *        description: Reservation was successfully deleted.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message about the request's result.
 *                  example: Reservation '2' was deleted.
 *                reservation:
 *                  $ref: '#/components/schemas/Reservations'
 */
router.delete('/:id', authRequired, (req, res) => {
  const id = req.params.id;
  try {
    Reservations.findReservationByID(id).then((reservation) => {
      Reservations.removeReservation(reservation.id).then(() => {
        res
          .status(200)
          .json({ message: `Reservation '${id}' was deleted.`, reservation });
      });
    });
  } catch (err) {
    res.status(500).json({
      message: `Could not delete reservation with ID: ${id}`,
      error: err.message,
    });
  }
});

module.exports = router;
