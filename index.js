var fs = require('fs');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
/* CONFIGURATION DU SERVEUR WEB */
var port = process.env.PORT || 3010;


var limite_synchro = 3; // gestion synchro si num_clients > limite_synchro
var num_clients = 0;
var tickInterval;
var tickDelay = 150; // 15ms selon source, tempo pour envoi du snapshot par le serveur

var typeSync;
var snapshot = {
  lines: []
};
var infos_clients = {
  num_clients: num_clients,
  limite_synchro: limite_synchro,
  tickDelay: tickDelay
}
var lastScreenshot;

server.listen(port, function() {
  console.log('Server listening at port %d', port);
});
// route to static files
app.use(express.static(__dirname + '/public'));
app.get('*', function(req, res){
  res.sendFile("/public/index.html", {root: '.'});
});

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  function (socket) {
    console.log("We have a new client: " + socket.id);
    socket.on('disconnect', function() {
     console.log("Client has disconnected");
   });

   socket.on('mouse',
      function(data) {
        // Data comes in as whatever was sent, including objects
        console.log("Received: 'mouse' " + data.x + " " + data.y);
        // Send it to all other clients
        socket.broadcast.emit('mouse', data);
      }
    );

  }
);
