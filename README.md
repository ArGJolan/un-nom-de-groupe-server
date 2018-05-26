# un-nom-de-groupe-server

Server for a house planning management web application

Prerequisites:

- Mongo server running
- npm
- NodeJs

Launch steps:

- `npm install`
- `cp config/config.js config/config.local.js`
- Edit config/config.local.js to your settings
- `npm start`

## Current functional routes are (with the body required in parethesis)

These routes don't require anything

- `POST /api/login ({ email, password })`
- `POST /api/register ({ email, password })`

These next routes require to be logged in (Authorization header set to a valid apiKey)

- `GET /api/account`

The next routes require to be logged in as an admin

- `POST /api/account/approve ({ email })`
- `GET /api/account/all`
- `DELETE /api/account ({ email })`
