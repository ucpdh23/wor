const express = require('express');
const Utils = require('../dto/utils')
const EnergyUtils =require('../dto/energyUtils');

const router = express.Router();

//const Task = require('../models/Task');

const manager = require('../service/stageManager');


router.get('/', async (req, res) => {
  var stage = manager.getStage(1);

  if (!stage || stage.status < 1) {
    res.end(JSON.stringify({}));
  } else {
    res.end(JSON.stringify(Utils.createOutputCyclists(stage.cyclists)));
  }
  
});

router.post('/:id', async (req, res) => {
  console.log('ID:', req.params.id);

  var stage = manager.getStage(1);
  var cyclist = Utils.findCyclist(stage, parseInt(req.params.id));

  /*
  var debug = stage.debug;

  if (debug && debug.cyclist && debug.cyclist.id === cyclist.id) {
    stage.debug.cyclist = undefined;
  } else {
    stage.debug =  { ...debug, cyclist: cyclist};
  }
 */

  
  res.end(JSON.stringify(Utils.createOutputCyclist(cyclist)));
  console.log("done")
});

router.post('/:id/operation/:operation', async (req, res) => {
  let operation = req.params.operation;
  console.log('ID:' + req.params.id);
  console.log('operation:' + operation);
  
  var stage = manager.getStage(1);
  var cyclist = Utils.findCyclist(stage, parseInt(req.params.id));
  
  var payload = {};
  if (operation === 'pulling') {
    var level = EnergyUtils.computeLevelPull(cyclist);
    console.log('level:'+level)
    payload = level;
  }
  
  cyclist.sendMessage(req.params.operation,payload);
  console.log('done op:'+operation)
  res.end();
});


function createObject(list) {
  var output = []
  for (var i =0; i < list.lenght; i++) {
    var item = list[i];
    output.push({id: item.id, number : item.number,
      position : {x: item.position.x, y: item.position.y}});
  }
}



module.exports = router;