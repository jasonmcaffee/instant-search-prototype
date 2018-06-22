# Hapi, Babel, etc Baseline
Fork this project and use it as a baseline for new service development

## Setup
Run these install steps
```
# install nvm so we can switch between versions of node
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

#install and use latest version of node
nvm install node
nvm use node

#install global modules
npm install nodemon -g
npm install babel-cli -g
npm install eslint -g
npm install nodemon -g
npm install jasmine -g
npm install

#test running the build
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

#### BASE_KEY_PATH (optional)
defaults to relative path of './keys'

### Running Locally
After each change, you'll want to build and restart your service.
This can be done automatically by using babel file watch(for auto building) and nodemon (for auto service restart)
#### nodemon
With this option, any changes made to js files will automatically update the service so you don't have to build or restart.
```
NODE_ENV=local nodemon index.js
```

#### babel file watch compilation
To have babel build files on change, rather than explicitly having to rebuild after each change, run:
```
npm run build-watch
```

#### Webstorm Configuration
Assuming you want to run nodemon with IDE debugging, you can setup a new Node.js run configuration similar to:

Node interpreter:
```
~/.nvm/versions/node/v10.4.0/bin/node
```
Node parameters:
```
/Users/jason.mcaffee/.nvm/versions/node/v10.4.0/bin/nodemon --inspect=3001
```
Working directory:
```
~/Documents/dev/hapi-babel-baseline
```
Javascript file:
```
index.js
```
Application Parameters:

Environment Variables:
```
NODE_ENV=local;STRIP_NEWLINE_CHARS=false;
```

## Swagger UI
All endpoints/handlers/routes with the 'api' tag will be made available in Swagger UI.
The path is Swagger UI is http://localhost:3000/docs

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

### Hapi Auth JWT2
Used for decrypting jwt tokens provided by IDM.

### Node-fetch
Browser Http fetch api for node.




