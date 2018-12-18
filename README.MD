#TODO
- rx.js v5,  don't search until typing has stopped for N ms (ask Merilee)
- look for instant search component.

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



