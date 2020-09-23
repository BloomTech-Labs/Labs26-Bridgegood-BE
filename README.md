# BridgeGood API

This repository contains the back-end API for the BridgeGood reservation/donation system. The full-stack website application was built during Lambda Labs in conjuntion with a stakeholder, BridgeGood, proudly based in Oakland, California.

BridgeGood is a co-op space for designers local to the Oakland, California area. Recently, BridgeGood aquired a physical location to allow their community to use while designing. BridgeGood came to Lambda School in search of a team to create a software solution.

## Getting Started

- To get started with this repository, fork and clone the repository to your machine (local or virtual).
- run: `npm install` to download all dependencies.
- run: `cp .env.sample .env` and update the enviornment variables to match your local setup (see .env variable options below).
- run: `npm run knex migrate:latest` to create the starting schema.
- run: `npm run knex seed:run` to populate your db with some data.
- run: `npm run tests` to confirm all is setup and tests pass.
- run: `npm run watch:dev` to start nodemon in local dev enviornment.

### Enviornment Variables

- `PORT` - API port (optional, but helpful with FE running as well)
- The following ports are whitelisted for use with okta - 3000 - 8000 - 8080
- `DATABASE_URL` - connection string for postgres database
- `OKTA_URL_ISSUER` - The complete issuer URL for verifying okta access tokens. `https://example.okta.com/oauth2/default`
- `OKTA_CLIENT_ID` - the okta client ID.

### API Documentation

- All of the documentation on the up to date, and usuable, endpoints for the API can be found at `https://bridgegood-api.herokuapp.com/api-docs/`.

## Meet the Team

| Name             | Role                 |
| ---------------- | -------------------- |
| Ana Carillo      | Project Team Lead    |
| Alexander Besse  | Back-End Developer   |
| Anthony Koharian | Full Stack Developer |
| Yasir Hamm       | Front End Developer  |
| Drake Alia       | Front End Developer  |
| Gregory Hawman   | Front End Developer  |

_**Want to contribute?**_
See the [contributing doc](https://github.com/Lambda-School-Labs/labs-api-starter/blob/main/CONTRIBUTING.md) for more info.
