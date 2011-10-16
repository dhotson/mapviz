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

// Listen for live tweets and broadcast to Socket.IO clients
var TwitterNode = require('twitter-node').TwitterNode;

var twit = new TwitterNode({
  user: 'twitterusername',
  password: 'twitterpassword',
  track: ['99designs', '99 designs'],
  follow: [14470037]
});

twit.addListener('tweet', function(tweet) {
	if (tweet.geo && tweet.geo.coordinates) {
		var obj = {
			type: 'tweet',
			latitude: tweet.geo.coordinates[0],
			longitude: tweet.geo.coordinates[1],
			tweet: tweet
		};
		io.sockets.emit('event', JSON.stringify(obj));
  }
})
.addListener('end', function(resp) {
	setTimeout(function() { twit.stream(); }, 60000); // reconnect after 1 min
});

twit.stream();
