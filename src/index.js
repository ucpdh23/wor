const express = require('express')
const app = express()
const port = process.env.PORT || 5000

const { Server } = require('ws');


// Middlewares
app.use(express.json());

// routes
app.use('/api/stage', require('./routes/stage'));

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

const Cyclist = require('./dto/cyclist')

var cyclist = new Cyclist();

var cyclists = [cyclist];

const Status = require('./dto/status');
var status =new Status(cyclists);


console.log(cyclist.id);

setInterval(() => {
  wss.clients.forEach((client) => {
   // client.send(new Date().toTimeString());
   client.send(JSON.stringify(status));
  });
}, 200);

var counter = 0;

const updater = require('./workers/updater')

setInterval(() => {
  //counter++;
  updater.update(20, status);
}, 20);
