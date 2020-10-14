module.exports = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'BridgeGood API Documentation',
      version: '1.0.0',
      description: 'BridgeGood - Documentation for the API.',
      license: {
        name: 'MIT',
        url: 'https://en.wikipedia.org/wiki/MIT_License',
      },
    },
    tags: [
      {
        name: 'Status',
        description: 'Status of the API',
      },
      {
        name: 'Users',
        description: 'Documentation for the endpoints related to Users.',
      },
      {
        name: 'Reservations',
        description: 'Documentation for the endpoints related to Reservations.',
      },
    ],
    components: {
      securitySchemes: {
        okta: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'Okta idToken JWT',
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
        },
        BadRequest: {
          description: 'Bad request.',
        },
        NotFound: {
          description: 'Not Found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    description: 'A message about the result',
                    example: 'User was not found.',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./api/**/*Route.js', './api/**/*Router.js'],
};
