const express = require('express');
const router = express.Router();


const manager = require('../service/stageManager');


router.get('/', async (req, res) => {
  console.log('get profile');

  var stage = manager.getStage(1);
  
  res.send(JSON.stringify({etapa: stage.profile.etapa}));
});

module.exports = router;