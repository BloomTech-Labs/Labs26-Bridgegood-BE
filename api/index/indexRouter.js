var express = require('express');
var router = express.Router();

/**
 * @swagger
 * /:
 *  get:
 *    description: Root endpoint, returns the status of the API.
 *    tags:
 *      - Status
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Returns up status and current timestamp.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - api
 *              properties:
 *                api:
 *                  type: boolean
 *                  example: true
 *                timestamp:
 *                  type: number
 *                  example: 1602272983985
 */
router.get('/', function (req, res) {
  res.status(200).json({ api: 'up', timestamp: Date.now() });
});

module.exports = router;
