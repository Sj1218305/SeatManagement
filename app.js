var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http, {'pingInterval' : 2000, 'pingTimeout' : 10000});
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs')
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
fs = require('fs');


// var options = {
//   key: fs.readFileSync('certs/smart24x7_wild_2019.key'),
//   cert: fs.readFileSync('certs/cert_chain.crt'),
//   };

var https = require('https');

// var server = https.createServer(app).listen('3000');

// var io = require('socket.io').listen(server, {'pingInterval': 2000, 'pingTimeout': 10000 })

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

  fs.readFile('teamData.json', 'utf-8', (err, data) => {
    if (err) throw err
    fromConfigFile = JSON.parse(data);
    socket.emit("fromConfigFile", fromConfigFile);
  })

    socket.on("saveTheData", function (canvasData,seatData, sCtr, tCtr, curfloor) {
        theData = canvasData;
        theSeatData = seatData;
        seatCtr = sCtr;
        tableCtr = tCtr;
        currentFloor = curfloor;
        fs.writeFile('theData'+currentFloor+'.txt', theData, function (err) {
          if (err) return console.log(err);
          console.log('file written');
        });
        fs.writeFile('theSeatData'+currentFloor+'.txt', theSeatData, function (err) {
          if (err) return console.log(err);
          console.log('file written');
        });
        fs.writeFile('seatCtr'+currentFloor+'.txt', seatCtr, function (err) {
          if (err) return console.log(err);
          console.log('file written');
        });
        fs.writeFile('tableCtr'+currentFloor+'.txt', tableCtr, function (err) {
          if (err) return console.log(err);
          console.log('file written');
        });
        
    })

    socket.on("bringData", function (data) {
        console.log("sending data for " + data);
        currentFloor = data;
        fs.readFile("theData"+currentFloor+".txt", function(err, buf) {
          if (err) return console.log(err);
         // console.log(buf.toString());
          theData = buf.toString();
        });
        fs.readFile("theSeatData"+currentFloor+".txt", function(err, buf) {
          if (err) return console.log(err);
          //console.log(buf.toString());
          theSeatData = buf.toString();
        });
        fs.readFile("seatCtr"+currentFloor+".txt", function(err, buf) {
          if (err) return console.log(err);
          //console.log(buf.toString());
          seatCtr = buf.toString();
        });
        fs.readFile("tableCtr"+currentFloor+".txt", function(err, buf) {
          if (err) return console.log(err);
         // console.log(buf.toString());
          tableCtr = buf.toString();
        });

        io.emit("loadTheData", theData, theSeatData, seatCtr, tableCtr, currentFloor);
    })

});


http.listen(3000, () => {
  console.log('server Started');
});


/*
orange - hot seat - anyone can sit
grey - disabled seat - not to be alloted to anyone
green - seat has been allocated
red - vacant seat
black - alloted to another team, can select and edit own team and view other team
*/
