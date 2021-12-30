const express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http, {
  'pingInterval': 2000,
  'pingTimeout': 10000
});
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs')
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'src')));
fs = require('fs');

var https = require('https');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

var theData;
var seatCtr;
var tableCtr;
var theSeatData;
var currentFloor;
var fromConfigFile = {};


io.on('connection', (socket) => {
  console.log('a user connected');

  fs.readFile('db/teamData.json', 'utf-8', (err, data) => {
    if (err) throw err
    fromConfigFile = JSON.parse(data);
    socket.emit("fromConfigFile", fromConfigFile);
  })

  socket.on("saveTheData", function (canvasData, seatData, sCtr, tCtr, curfloor) {
    theData = canvasData;
    theSeatData = seatData;
    seatCtr = sCtr;
    tableCtr = tCtr;
    currentFloor = curfloor;
    fs.writeFile('db/theData' + currentFloor + '.txt', theData, function (err) {
      if (err) return console.log(err);
      console.log('file written');
    });
    fs.writeFile('db/theSeatData' + currentFloor + '.txt', theSeatData, function (err) {
      if (err) return console.log(err);
      console.log('file written');
    });
    fs.writeFile('db/seatCtr' + currentFloor + '.txt', seatCtr, function (err) {
      if (err) return console.log(err);
      console.log('file written');
    });
    fs.writeFile('db/tableCtr' + currentFloor + '.txt', tableCtr, function (err) {
      if (err) return console.log(err);
      console.log('file written');
    });

  })

  socket.on("bringData", function (data) {
    console.log("sending data for " + data);
    currentFloor = data;
    fs.readFile("db/theData" + currentFloor + ".txt", function (err, buf) {
      if (err) return console.log(err);
      // console.log(buf.toString());
      theData = buf.toString();
    });
    fs.readFile("db/theSeatData" + currentFloor + ".txt", function (err, buf) {
      if (err) return console.log(err);
      //console.log(buf.toString());
      theSeatData = buf.toString();
    });
    fs.readFile("db/seatCtr" + currentFloor + ".txt", function (err, buf) {
      if (err) return console.log(err);
      //console.log(buf.toString());
      seatCtr = buf.toString();
    });
    fs.readFile("db/tableCtr" + currentFloor + ".txt", function (err, buf) {
      if (err) return console.log(err);
      // console.log(buf.toString());
      tableCtr = buf.toString();
    });

    io.emit("loadTheData", theData, theSeatData, seatCtr, tableCtr, currentFloor);
  })

});


http.listen(process.env.PORT || 3000, () => {
  console.log('server Started');
});


/*
orange - hot seat - anyone can sit
grey - disabled seat - not to be alloted to anyone
green - seat has been allocated
red - vacant seat
black - alloted to another team, can select and edit own team and view other team
*/