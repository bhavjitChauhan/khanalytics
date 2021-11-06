const { Worker, SHARE_ENV } = require("worker_threads");


const createWorker = (fn, ...args) => new Worker(`process.env.${fn.name} = (${fn.toString()})(${args.join()})`, { eval: true, env: SHARE_ENV });

module.exports = createWorker;
