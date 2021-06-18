const {Worker} = require("worker_threads");

const express = require('express');
const router = express.Router();

//const Task = require('../models/Task');

router.get('/', async (req, res) => {
  console.log('start stage');
  
  const worker = new Worker(__dirname + "/workers/stage.js", {workerData: {num: 40}});
worker.once("message", result => {
  console.log(`${num}th Fibonacci Number: ${result}`);
});

  
  res.send('responseeee');
});

module.exports = router;