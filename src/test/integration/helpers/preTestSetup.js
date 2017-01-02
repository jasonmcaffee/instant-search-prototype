/* eslint no-process-env: "off" */
/**
 * We don't want to use relative paths when requiring modules, so we need to set the NODE_PATH to be root/build.
 * Helpers execute before specs run.
 */
console.log('integration test preTestSetup script running...');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log('dir: ' + __dirname);
console.log('cwd:' + process.cwd());
process.env.NODE_PATH = process.cwd() + '/build';
require('module').Module._initPaths();
console.log('NODE_PATH is ' + process.env.NODE_PATH);


beforeAll(async (done)=>{
  await setupIntegration();
  console.log('starting integration tests....');
  done();
});

async function setupIntegration(){
  console.log('setting up for integration testing...');
  const spawn = require('child_process').spawn;
  const ls = spawn('npm', ['run', 'start']);

  let serverStartedPromise = new Promise((resolve, reject)=>{
    ls.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
      if(data.indexOf('Server running') >= 0){
        console.log('server is running. tests can begin.');
        resolve();
      }

    });

    ls.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      if(data.indexOf('os.tmpDir()') < 0){
        reject(data);
        ls.kill();//force the process to die
      }
    });

    ls.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      reject({code});
    });

  });

  jasmine.getEnv().addReporter({
    jasmineDone(){
      console.log('############################jasmine is done################');
      ls.kill();
    }
  });

  process.on('beforeExit', ()=>{
    console.log('process beforeExit...');
    ls.kill();
  });

  process.on('exit', ()=>{
    console.log('process exit...');
    ls.kill();
  });

  afterAll((done)=>{
    console.log('done with stuff');
    ls.kill();
    done();
  });

  return await serverStartedPromise;
}