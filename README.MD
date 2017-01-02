# Hapi, Babel, etc Baseline
Fork this project and use it as a baseline for new service development

## Setup
To setup, you can run a convenience script
```
npm run initial-setup
```
OR
```
npm install
npm install babel-cli -g
npm install eslint -g
npm install nodemon -g
npm install jasmine -g
npm run build
```
Since we are using babel for transpilation, a build step is required (npm run build)

### Environment Variables
Rather than having different configs for each environment, we will have 1 config which references environment variables.

#### NODE_ENV (required)
in order to read the idm_public_key.pem from the correct subfolder in keys dir, must be set to one of the following:
```
local
alpha
beta
production
```

#### SERVER_PORT (required)
port the server listens on.  this will be used for docker:run npm scripts.  the port will be exposed and mapped to same port on host.
e.g.
```
docker run -it --expose=${SERVER_PORT} -p ${SERVER_PORT}:${SERVER_PORT} ...
```

#### STRIP_NEWLINE_CHARS (optional)
By default the logger module will remove new line chars (each new line results in a separate log entry in gray log)

This can be optionally override to false so that multiline logs are emitted.


#### BYPASS_USER_AUTH (optional)
for local development only. if set to 'true' all endpoints won't require jwt token.
this intentionally will not work inside of a docker container (for security reasons)

#### BASE_KEY_PATH (optional)
defaults to relative path of './keys'

### Running Locally
#### Run babel file watch and nodemon
With this option, any changes made to js files will automatically update the service so you don't have to build or restart.
```
npm run start-local
```

#### babel file watch compilation
To have babel build files on change, rather than explicitly having to rebuild after each change, run:
```
npm run build-watch
```

## Swagger UI
All endpoints/handlers/routes with the 'api' tag will be made available in Swagger UI.
The path is Swagger UI is http://localhost:1337/docs/index.html

## Project Structure

### Build
We use babel for transpilation, so a build and a build folder are needed.

### Keys
IDM public keys are needed in order to decrypt the jwt token provided by IDM.

### Src
Contains all files which are transpiled, including services, routes, tests, etc.

#### Config
Configuration files.  Typically will reference environment variables.

#### Routes
Hapi routes handle request/response for given uri paths.

#### Schemas
Joi schemas are used to validate requests, ensure response format, and other needed object validations needed.

#### Services
Most routes will validate requests then forward calls to related service methods.

Services should be unaware of http concepts (errors, response handling, etc)

#### Test
All test files related to unit, integration, and performance tests.


## External Libraries/Packages

### Babel
allows us to use javascript features not yet implemented in node.js, such as module import/export, async await, etc.

### Joi
provides schema validation so we can validate request parameters, body, etc.

### Hapi Swagger UI
auto generates swagger documentation based on handler config and Joi schemas referenced in handler config.
No Yaml!!

### Bluebird
Useful promise library for promisifying traditional callback functions, etc.

### Jasmine
Unit testing framework

### ESLint
Code standard enforcement



