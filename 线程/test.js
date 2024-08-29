const { Worker } = require('worker_threads')
function delay(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true)
        }, time);
    })
}
async function runWorker(workerData) {
    //线程 

    // const worker = new Worker('./worker.js', { workerData });
    // worker.on('message', (data) => {
    //     console.log('message from worker:', data);
    // });
    // worker.on('error', (err) => {
    //     console.log('worker error:', err);
    // });
    // worker.on('exit', (code) => {
    //     console.log('worker exit:', code);
    // })

    //同步 

    // let a = 0;
    // for (let index = 0; index < 9999999999; index++) {
    //     a++;
    // }

    //异步

    new Promise((resolve, reject) => {
        let a = 0
        for (let index = 0; index < 9999999999; index++) {
            a++;
        }
        resolve(true)
    })

}
async function log() {
    await delay(500)
    console.log(11111111);
    log()
}
runWorker('hello');
log()
