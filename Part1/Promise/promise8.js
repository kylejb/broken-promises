const { promisify } = require('util');
const { openSync, closeSync } = require('fs');
const sleep = promisify(setTimeout);

let leakedFd = false;

function DoSomething() {
  let fd = 0;
  return new Promise((resolve) => {
    fd = openSync(__filename, 'r+');
    leakedFd = true;
    functionThatDoesNotExist();
  }).catch(() => {
    closeSync(fd);
    leakedFd = false;
  });
}

DoSomething();
console.log('A');

process.on('exit', () => {
  console.log('File descriptor leaked?', leakedFd);
});
