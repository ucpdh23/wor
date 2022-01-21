const express = require('express')
var log = require('loglevel');
log.setLevel("debug")

const app = express()
const port = process.env.PORT || 5000

const { Server } = require('ws');

const manager = require('./service/stageManager');
manager.init();

// static files
app.use(express.static(__dirname + '/public'));

// Middlewares
app.use(express.json());
app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
	next();
});

// routes
app.use('/api/stage', require('./routes/stage'));
app.use('/api/cyclist', require('./routes/cyclist'));
app.use('/api/profile', require('./routes/profile'));


// Server is listening
const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// web socket
const wss = new Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});


setInterval(() => {
  wss.clients.forEach((client) => {
    var status = manager.resolveStatus(client);
    client.send(JSON.stringify(status));
  });
}, 75);

const updater = require('./workers/updater')

var internal = setInterval(() => {
  var continueStage = updater.update(25, manager.getStage(1));

  if (!continueStage) {
    console.log("Stage 1 finished");
    clearInterval(manager.getInterval(1));
  }

}, 25);

manager.setInterval(1, internal);

log.info("started server!!!!!!!!!!!!!!!!!");
