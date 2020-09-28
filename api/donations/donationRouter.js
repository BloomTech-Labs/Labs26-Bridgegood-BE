const express = require('express');
const authRequired = require('../middleware/authRequired');
const Donations = require('./donationModel');
const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Donation:
 *      type: object
 *      required:
 *        - amount
 *        - user_id
 *      properties:
 *        amount:
 *          type: string
 *          description: The amount of the donation, ex. "12.00"
 *        user_id:
 *          type: string
 *          description: The UUID of the user who donated.
 *      example:
 *        user_id: 'd22b9b36-f699-4f46-bd01-6918772b4f59'
 *        amount: '12.00'
 *
 * /donations:
 *  get:
 *    description: Returns a list of all donations.
 *    summary: Get a list of all donations.
 *    security:
 *      - okta: []
 *    tags:
 *      - Donations
 *    responses:
 *      200:
 *        description: Successful response with a list of donations.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Donation'
 *              example:
 *                - user_id: 'd22b9b36-f699-4f46-bd01-6918772b4f59'
 *                  amount: '12.00'
 *                - user_id: 'd22b9b36-f699-4f46-bd01-6918772b4f59'
 *                  amount: '15.00'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', authRequired, function (req, res) {
  Donations.getAllDonations()
    .then((dono) => {
      res.status(200).json(dono);
    })
    .catch(({ message }) => {
      res.status(500).json({ message });
    });
});

/**
 * @swagger
 * components:
 *  parameters:
 *    donationid:
 *      name: id
 *      in: path
 *      description: ID of the donation to return.
 *      required: true
 *      example: '4b970621-8b98-4e02-b40d-813c52803dd7'
 *      schema:
 *        type: string
 *
 * /donations/{id}:
 *  get:
 *    description: Find donations by ID.
 *    summary: Returns a single donation by ID.
 *    security:
 *      - okta: []
 *    tags:
 *      - Donations
 *    parameters:
 *      - $ref: '#/components/parameters/donationid'
 *    responses:
 *      200:
 *        description: Successful response, returns a singular donation.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Donation'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        description: 'Donation not found'
 */
router.get('/:id', authRequired, function (req, res) {
  const id = String(req.params.id);
  Donations.findDonationByID(id)
    .then((donation) => {
      if (donation) {
        res.status(200).json(donation);
      } else {
        res.status(404).json({ error: 'DonationNotFound' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

/**
 * @swagger
 * /donations:
 *  post:
 *    summary: Add a donation.
 *    security:
 *      - okta: []
 *    tags:
 *      - Donations
 *    requestBody:
 *      description: An object with the details about the reservation. See required information for base structure.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Donations'
 *    responses:
 *      400:
 *        $ref: '#/components/responses/BadRequest'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        description: 'Donation not found.'
 *      200:
 *        description: Donation successfully created and added.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message about request's result.
 *                  example: Donation successfully created and added.
 *                reservation:
 *                  $ref: '#/components/schemas/Donation'
 */
router.post('/', authRequired, async (req, res) => {
  const donation = req.body;
  if (donation) {
    const id = donation.id || 0;
    try {
      await Donations.findDonationByID(id).then(async (dono) => {
        if (dono == undefined) {
          // Donation not found so lets insert it
          await Donations.createDonation(donation).then((result) =>
            res.status(200).json({
              message: 'Donation successfully created.',
              donation: result[0],
            })
          );
        } else {
          res.status(400).json({ message: 'Donation already exists.' });
        }
      });
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  } else {
    res
      .status(400)
      .json({ message: 'There was a problem creating the donation. (400)' });
  }
});

module.exports = router;
