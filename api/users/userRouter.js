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
 *        - first_name
 *        - last_name
 *        - school
 *        - bg_username
 *        - phone
 *        - email
 *        - password
 *      properties:
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
 *        email:
 *          type: string
 *          description: The user's e-mail address.
 *        phone:
 *          type: string
 *          description: The user's phone number.
 *        password:
 *          type: string
 *          description: The user account password.
 *      example:
 *        first_name: 'Shannan'
 *        last_name: 'Roe'
 *        school: 'Lambda School'
 *        bg_username: 'ShannanRoe1928'
 *        email: 'Lambda@School.com'
 *        phone: '6510000000'
 *        password: 'Strong!PasswordH3R3'
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
 *                - id: '1'
 *                  first_name: 'Alexander'
 *                  last_name: 'Besse'
 *                  school: 'Lambda School'
 *                  bg_username: 'AlexanderBesse2491'
 *                  email: 'Lambda@School.com'
 *                  phone: '6510000000'
 *                  created_at: '2020-09-08 20:41:29.183465+00'
 *                - id: '2'
 *                  first_name: 'Shannan'
 *                  last_name: 'Roe'
 *                  school: 'Lambda School'
 *                  bg_username: 'ShannanRoe1928'
 *                  email: 'Lambda@School.com'
 *                  phone: '6510000000'
 *                  created_at: '2020-09-08 20:41:29.183465+00'
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
 *      description: ID of the user to return.
 *      required: true
 *      example: 1
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
  Profiles.findById(id)
    .then((profile) => {
      if (profile) {
        res.status(200).json(profile);
      } else {
        res.status(404).json({ error: 'ProfileNotFound' });
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
 *                profile:
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
          message: `Could not find profile '${id}'`,
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
 *                profile:
 *                  $ref: '#/components/schemas/User'
 */
router.delete('/:id', authRequired, (req, res) => {
  const id = req.params.id;
  try {
    Users.findUserByID(id).then((user) => {
      Users.removeUser(user.id).then(() => {
        res.status(200).json({ message: `Profile '${id}' was deleted.`, user });
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
