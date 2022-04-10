const express = require('express')
var log = require('loglevel');
log.setLevel("debug")

const app = express()
require('dotenv').config();

const port = process.env.PORT || 5000

const { Server } = require('ws');

const manager = require('./service/stageManager');
manager.init();

// static files
app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next){
    res.setTimeout(15000, function(){
        console.log('Request has timed out.');
            res.send(408);
        });

    next();
});

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

// Communication with web clients
setInterval(() => {
  wss.clients.forEach((client) => {
    var status = manager.resolveStatus(client);
    client.send(JSON.stringify(status));
  });
}, 75);


log.info("started server!!!!!!!!!!!!!!!!!");
