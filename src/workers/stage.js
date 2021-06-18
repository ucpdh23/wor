const {parentPort, workerData} = require("worker_threads");

parentPort.postMessage(getFib(workerData.num))

function getFib(num) {
  console.log(num);
  
    if (num === 0) {
      return 0;
    }
    else if (num === 1) {
      return 1;
    }
    else {
      return getFib(num - 1) + getFib(num - 2);
    }
}