# Real Time Search Testing
Project to explore options for real time search needed in provisioner.

## Approach

### Ajax with Keep Alive
Ajax requests are made with connection keep alive headers so we don't have to re-establish connection with each search.

### Explore Search Options
The web app offers demos fo several approaches to searching, including limiting max number of searches at a time, debouncing, etc.

## Testing

### Connection Keep Alive

#### Curl
To test that the server you are hitting supports connection keep alive, run this:
```
curl -Iv http://localhost:3000/v1/search?q=a 2>&1 | grep -i 'connection #0'
```
Verify the result is:
```
Connection #0 to host localhost left intact
```

## Setup

### Service
Run these install steps
```
# install nvm so we can switch between versions of node
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

#install and use latest version of node
nvm install 10.4
nvm use 10.4

#install global modules
npm install babel-cli -g
npm install eslint -g
npm install jasmine -g

#open a new terminal window or set the source for your bash profile

#install local modules
npm install

#test running the build
npm run build

```

### Web App
```
cd web-app
npm install

```
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




