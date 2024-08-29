const { workerData, parentPort } = require('worker_threads')
parentPort.postMessage(test())

function test() {
    let a = 0;
    for (let index = 0; index < 9999999999; index++) {
        a++;
    }
    console.log("------------------", a);

}