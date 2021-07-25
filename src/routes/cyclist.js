const express = require('express');
const Utils = require('../dto/utils')

const router = express.Router();

//const Task = require('../models/Task');

const manager = require('../service/stageManager');


router.get('/', async (req, res) => {
  console.log('get cyclists');

  var stage = manager.getStage(1);
  
  res.send(JSON.stringify(Utils.createOutputCyclists(stage.cyclists)));
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