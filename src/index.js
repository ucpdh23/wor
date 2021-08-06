const express = require('express')
var log = require('loglevel');
log.setLevel("debug")

const app = express()
const port = process.env.PORT || 5000

const { Server } = require('ws');

const manager = require('./service/stageManager');
manager.init();

// Middlewares
app.use(express.json());

// routes
app.use('/api/stage', require('./routes/stage'));
app.use('/api/cyclist', require('./routes/cyclist'));
app.use('/api/profile', require('./routes/profile'));

app.use(express.static(__dirname + '/public'));


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

setInterval(() => {
  updater.update(25, manager.getStage(1));
}, 25);

log.info("started server!!!!!!!!!!!!!!!!!");
