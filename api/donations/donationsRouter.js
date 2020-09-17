const express = require('express');
const authRequired = require('../middleware/authRequired');
const Donations = require('./donationsModel');
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
 *          description: Amount of the donation.
 *        user_id:
 *          type: string
 *          description: The id of the user who donated.
 *      example:
 *        id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
 *        amount: '20.00'
 *        user_id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
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
 *                - id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
 *                  amount: '25.00'
 *                  user_id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', authRequired, function (req, res) {
  Donations.getAllDonations()
    .then((d) => {
      res.status(200).json(d);
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
 *      example: 1
 *      schema:
 *        type: string
 *
 * /donations/{id}:
 *  get:
 *    description: Find donation by ID
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
  Donations.findDonationsByID(id)
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
 *      description: An object with the details about the donation. See required information for base structure.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Donation'
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
 *                donation:
 *                  $ref: '#/components/schemas/Donation'
 */
router.post('/', authRequired, async (req, res) => {
  const donation = req.body;
  if (donation) {
    const id = donation.id || 0;
    try {
      await Donations.findDonationsByID(id).then(async (d) => {
        if (d == undefined) {
          // Donation not found so lets insert it
          await Donations.createDonation(donation).then((donation) =>
            res.status(200).json({
              message: 'Donation successfully created.',
              donation: donation[0],
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
      .status(404)
      .json({ message: 'There was a problem creating the donation. (404)' });
  }
});

/**
 * @swagger
 * /donations:
 *  put:
 *    summary: Update a donation.
 *    security:
 *      - okta: []
 *    tags:
 *      - Donations
 *    requestBody:
 *      description: Object containing the information to update.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Donation'
 *    responses:
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      200:
 *        description: The updated donation.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message about request's result.
 *                  example: Donation successfully updated.
 *                profile:
 *                  $ref: '#/components/schemas/Donation'
 */
router.put('/', authRequired, (req, res) => {
  const donation = req.body;
  if (donation) {
    const id = donation.id || 0;
    Donations.findDonationsByID(id)
      .then(
        Donations.updateDonation(id, donation)
          .then((updated) => {
            res
              .status(200)
              .json({ message: 'Donation updated.', donation: updated[0] });
          })
          .catch((err) => {
            res.status(500).json({
              message: `Could not update donation: '${id}'`,
              error: err.message,
            });
          })
      )
      .catch((err) => {
        res.status(404).json({
          message: `Could not find donation '${id}'`,
          error: err.message,
        });
      });
  }
});
/**
 * @swagger
 * /donations/{id}:
 *  delete:
 *    summary: Remove a donation.
 *    security:
 *      - okta: []
 *    tags:
 *      - Donations
 *    parameters:
 *      - $ref: '#/components/parameters/donationid'
 *    responses:
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      200:
 *        description: Donation was successfully deleted.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message about the request's result.
 *                  example: Donation was deleted.
 *                profile:
 *                  $ref: '#/components/schemas/Donation'
 */
router.delete('/:id', authRequired, (req, res) => {
  const id = req.params.id;
  try {
    Donations.findDonationsByID(id).then((donation) => {
      Donations.removeDonation(donation.id).then(() => {
        res
          .status(200)
          .json({ message: `Donation '${id}' was deleted.`, donation });
      });
    });
  } catch (err) {
    res.status(500).json({
      message: `Could not delete donation with ID: ${id}`,
      error: err.message,
    });
  }
});

module.exports = router;
