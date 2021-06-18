const express = require('express');
const router = express.Router();

//const Task = require('../models/Task');

router.get('/', async (req, res) => {
  console.log('start stage');
  res.send('responseeee');
});

module.exports = router;