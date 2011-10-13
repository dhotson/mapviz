// Serve static content
var connect = require('connect');
var server = connect(
	connect.static(__dirname + '/public', { maxAge: 3600 })
);

// Socket.IO server
var io = require('socket.io').listen(server);
io.configure(function() {
	io.set('log level', 1);
});

server.listen(8000);

// UDP server listens for events and broadcasts to Socket.IO clients
var dgram = require("dgram");
var eventListener = dgram.createSocket("udp4", function (msg, rinfo) {
	// console.log(msg.toString('utf8'));
	io.sockets.emit('event', msg.toString('utf8'));
});
eventListener.bind(4000);

