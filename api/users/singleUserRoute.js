const express = require('express');
const authRequired = require('../middleware/authRequired');
const Users = require('./userModel');
const router = express.Router();

/**
 * @swagger
 * /user:
 *  get:
 *    description: Return currently authenticated user.
 *    summary: Return currently authenticated user.
 *    security:
 *      - okta: []
 *    tags:
 *      - Users
 *    responses:
 *      200:
 *        description: Successful response with user information.
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
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      400:
 *        message: 'A currently authenicated user was not found.'
 */
router.get('/', authRequired, async function (req, res) {
  const { user } = req;
  if (!user)
    return res.status(400).json({
      error: 'A currently authenicated user was not found.',
    });
  else {
    let record = await Users.findUserByFilter({ email: user });
    if (!record) {
      record = Users.findOrCreateUser({
        email: user,
      });
    }
    return res.status(200).json({
      user: record[0],
    });
  }
});

module.exports = router;
