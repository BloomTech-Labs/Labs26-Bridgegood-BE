const express = require('express');
const authRequired = require('../middleware/authRequired');
const Users = require('./userModel');
const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - id
 *        - first_name
 *        - last_name
 *        - school
 *        - bg_username
 *        - profile_url
 *        - isLocked
 *        - praises
 *        - demerits
 *        - user_rating
 *        - visits
 *        - reservations
 *        - role_id
 *        - phone
 *        - email
 *      properties:
 *        id:
 *          type: string
 *          description: User's UUID.
 *        first_name:
 *          type: string
 *          description: The first name of the user.
 *        last_name:
 *          type: string
 *          description: The last name of the user.
 *        school:
 *          type: string
 *          description: The title of the school that the user attends.
 *        bg_username:
 *          type: string
 *          description: The BridgeGood username that the user already holds on the primary website.
 *        profile_url:
 *          type: string
 *          description: The profile URL for the user's bg_username on the primary BridgeGood website.
 *        email:
 *          type: string
 *          description: The user's e-mail address.
 *        phone:
 *          type: string
 *          description: The user's phone number.
 *        isLocked:
 *          type: boolean
 *          description: Determines if user's account is locked.
 *        praises:
 *          type: integer
 *          description: Number of praises the user has received.
 *        demerits:
 *          type: integer
 *          description: Number of demerits the user has received.
 *        user_rating:
 *          type: integer
 *          description: The sum of the user's praises minus demerits.
 *        visits:
 *          type: integer
 *          description: Number of check-ins.
 *        reservations:
 *          type: integer
 *          description: Number of reservations made.
 *        role_id:
 *          type: integer
 *          description: Foreign key to user's role.
 *        created_at:
 *          type: integer
 *          description: Timestamp of when the user was created.
 *        updated_at:
 *          type: integer
 *          description: Timestamp of when the user was last updated.
 *      example:
 *        id: '8f8464f7-c548-440d-95ac-6e64a277e405'
 *        role_id: 2
 *        first_name: 'Ana'
 *        last_name: 'Carillo'
 *        school: 'Merritt Community College'
 *        bg_username: 'ana_carillo'
 *        profile_url: 'https://www.bridgegood.dev/ana_carillo'
 *        email: 'llama001@maildrop.cc'
 *        phone: '6510000000'
 *        visits: 15
 *        reservations: 17
 *        praises: 5
 *        demerits: 1
 *        isLocked: false       
 *        created_at: '2020-10-08 16:22:07.65868+00'
 *        updated_at: '2020-10-08 16:22:07.65868+00'
 *
 * /users:
 *  get:
 *    description: Returns a list of all users.
 *    summary: Get a list of all users.
 *    security:
 *      - okta: []
 *    tags:
 *      - Users
 *    responses:
 *      200:
 *        description: Successful response with a list of users.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/User'
 *              example:
 *                - id: '0d4556c0-3f87-4a30-af62-bf10ab64afa6'
 *                  first_name: 'Alexander'
 *                  last_name: 'Besse'
 *                  school: 'Laney College'
 *                  bg_username: 'alexander_besse'
 *                  profile_url: 'https://www.bridgegood.dev/alexander_besse'
 *                  email: 'alexander_besse@maildrop.cc'
 *                  phone: '6510000000'
 *                  isLocked: 0,
 *                  praises: 0,
 *                  demerits: 0,
 *                  user_rating: 0,
 *                  visits: 0,
 *                  reservation: 0,
 *                  created_at: '2020-09-08 20:41:29.183465+00'
 *                  updated_at: '2020-09-08 20:41:29.183465+00'
 *                - id: '33fc3167-0905-4ee2-aed6-bedeaceeb79a'
 *                  first_name: 'Ana'
 *                  last_name: 'Carillo'
 *                  school: 'California College of the Arts'
 *                  bg_username: 'ana_carillo'
 *                  profile_url: 'https://www.bridgegood.dev/ana_carillo'
 *                  email: 'ana_carillo@maildrop.cc'
 *                  phone: '2180000000'
 *                  isLocked: 0,
 *                  praises: 0,
 *                  demerits: 0,
 *                  user_rating: 0,
 *                  visits: 0,
 *                  reservation: 0,
 *                  created_at: '2020-09-08 20:41:29.183465+00'
 *                  updated_at: '2020-09-08 20:41:29.183465+00'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', authRequired, function (req, res) {
  Users.getAllUsers()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch(({ message }) => {
      res.status(500).json({ message });
    });
});

/**
 * @swagger
 * components:
 *  parameters:
 *    userid:
 *      name: id
 *      in: path
 *      description: UUID of the user to return.
 *      required: true
 *      example: '33fc3167-0905-4ee2-aed6-bedeaceeb79a'
 *      schema:
 *        type: string
 *
 * /users/{id}:
 *  get:
 *    description: Find user by ID
 *    summary: Returns a single user by ID.
 *    security:
 *      - okta: []
 *    tags:
 *      - Users
 *    parameters:
 *      - $ref: '#/components/parameters/userid'
 *    responses:
 *      200:
 *        description: Successful response, returns a singular user.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        description: 'User not found'
 */
router.get('/:id', authRequired, function (req, res) {
  const id = String(req.params.id);
  Users.findUserByID(id)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: 'UserNotFound' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

/**
 * @swagger
 * /users:
 *  post:
 *    summary: Add a user.
 *    security:
 *      - okta: []
 *    tags:
 *      - Users
 *    requestBody:
 *      description: An object with the details about the user. See required information for base structure.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      400:
 *        $ref: '#/components/responses/BadRequest'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        description: 'User not found.'
 *      200:
 *        description: User successfully created and added.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message about request's result.
 *                  example: User successfully created and added.
 *                user:
 *                  $ref: '#/components/schemas/User'
 */
router.post('/', authRequired, async (req, res) => {
  const user = req.body;
  if (user) {
    const id = user.id || 0;
    try {
      await Users.findUserByID(id).then(async (usr) => {
        if (usr == undefined) {
          // User not found so lets insert it
          await Users.createUser(user).then((user) =>
            res
              .status(200)
              .json({ message: 'User successfully created.', user: user[0] })
          );
        } else {
          res.status(400).json({ message: 'User already exists.' });
        }
      });
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  } else {
    res
      .status(404)
      .json({ message: 'There was a problem creating the user. (404)' });
  }
});

/**
 * @swagger
 * /users:
 *  put:
 *    summary: Update a user.
 *    security:
 *      - okta: []
 *    tags:
 *      - Users
 *    requestBody:
 *      description: Object containing the information to update.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      200:
 *        description: The updated user.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message about request's result.
 *                  example: User successfully updated.
 *                user:
 *                  $ref: '#/components/schemas/User'
 */
router.put('/', authRequired, (req, res) => {
  const user = req.body;
  if (user) {
    const id = user.id || 0;
    Users.findUserByID(id)
      .then(
        Users.updateUser(id, user)
          .then((updated) => {
            res
              .status(200)
              .json({ message: 'User updated.', user: updated[0] });
          })
          .catch((err) => {
            res.status(500).json({
              message: `Could not update user: '${id}'`,
              error: err.message,
            });
          })
      )
      .catch((err) => {
        res.status(404).json({
          message: `Could not find user '${id}'`,
          error: err.message,
        });
      });
  }
});
/**
 * @swagger
 * /users/{id}:
 *  delete:
 *    summary: Remove a user.
 *    security:
 *      - okta: []
 *    tags:
 *      - Users
 *    parameters:
 *      - $ref: '#/components/parameters/userid'
 *    responses:
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      200:
 *        description: User was successfully deleted.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message about the request's result.
 *                  example: User '2' was deleted.
 *                user:
 *                  $ref: '#/components/schemas/User'
 */
router.delete('/:id', authRequired, (req, res) => {
  const id = req.params.id;
  try {
    Users.findUserByID(id).then((user) => {
      Users.removeUser(user.id).then(() => {
        res.status(200).json({ message: `User '${id}' was deleted.`, user });
      });
    });
  } catch (err) {
    res.status(500).json({
      message: `Could not delete user with ID: ${id}`,
      error: err.message,
    });
  }
});

module.exports = router;
