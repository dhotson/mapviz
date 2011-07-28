var socket = io.connect();
socket.on('event', function (data) {
	console.log(JSON.parse(data));
});

// --

var latitudeAsPercent = function(lat) {
	return ((lat + 90) / 180) * 100;
};

var longtitudeAsPercent = function(long) {
	return ((long + 180) / 360) * 100;
};

