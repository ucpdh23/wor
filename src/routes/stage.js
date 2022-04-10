const {Worker} = require("worker_threads");

const express = require('express');
const router = express.Router();

const fs = require('fs');

//const Task = require('../models/Task');
const manager = require('../service/stageManager');

router.get('/', async (req, res) => {
  console.log('start stage');
  
  
  const worker = new Worker(__dirname + "/../workers/stage.js", {workerData: {num: 4}});
  worker.once("message", result => {
    console.log(`th Fibonacci Number: ${result}`);
  });
  
  res.send('responseeee');
});

router.get('/start', async (req, res) => {
  manager.createStage("features").then(stage => {
    manager.startStage(stage.id);
  });

  res.end('starting');
});

router.get('/store', async (req, res) => {
  console.log('storing');
  
  var stage = manager.getStage(1);
  let cyclists = stage.cyclists;
  
  let cloned = [];
  for (cyclist of cyclists) {
    var item = {};
 
    item.position= cyclist.position;
    item.velocity = cyclist.velocity;
    item.acceleration=cyclist.acceleration;
    item.stateMachine=cyclist._stateMachine[0].value;

    cloned.push(item);
  }
  
  // stage.cyclists;
  fs.writeFileSync('./data.json', JSON.stringify(cloned, null, 2) , 'utf-8');
  
  
  res.send('stored');
});

router.get('/load', async (req, res) => {
  console.log('loading');
  
  var stage = manager.getStage(1);
  let cyclists = stage.cyclists;
  
  
  // stage.cyclists;
  const text = fs.readFileSync('./data.json', 'utf-8');
  var items = JSON.parse(text);
  for (i=0;i<cyclists.length;i++) {
    let cyclist = cyclists[i];
    let item = items[i];
    
    cyclist.position.x= item.position.x;
    cyclist.position.y= item.position.y;
    cyclist.velocity.x = item.velocity.x;
    cyclist.velocity.y = item.velocity.y;
    cyclist.acceleration.x=item.acceleration.x;
    cyclist.acceleration.y=item.acceleration.y;
    cyclist._stateMachine[0].value=item.stateMachine;
  }
  
  
  res.send('load');
});

module.exports = router;