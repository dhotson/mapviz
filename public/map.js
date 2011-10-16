var loginTemplate =
	'<div class="marker login">'+
	'  <div class="inner">'+
	'    <div class="shadow"></div>'+
	'    <div class="container">'+
	'     <div class="glow"></div>'+
	'     <div class="mask">'+
	'       <div class="content"></div>'+
	'     </div>'+
	'    </div>'+
	'  </div>'+
	'</div>';

var entryTemplate =
	'<div class="marker entry">'+
	'  <div class="inner">'+
	'    <div class="shadow"></div>'+
	'    <div class="container">'+
	'     <div class="mask">'+
	'       <div class="content"></div>'+
	'     </div>'+
	'     <div class="avatar"></div>'+
	'    </div>'+
	'  </div>'+
	'</div>';

var tweetTemplate =
	'<div class="marker tweet">'+
	'  <div class="inner">'+
	'    <div class="shadow"></div>'+
	'    <div class="container">'+
	'     <div class="mask">'+
	'       <div class="content">'+
	'         <div class="text">&nbsp;<div class="bird"></div></div>'+
	'         <div class="screenname"></div>'+
	'       </div>'+
	'     </div>'+
	'     <div class="avatar"></div>'+
	'    </div>'+
	'  </div>'+
	'</div>';


// Show a user logging in..
var login = function(data) {
	var e = $(Mustache.to_html(loginTemplate, {}));
	e.css({
		top: latitudeAsPercent(data.latitude)+'%',
		left: longitudeAsPercent(data.longitude)+'%'
	});

	// console.log([user.latitude, user.longitude, latitudeAsPercent(user.latitude), longtitudeAsPercent(user.longitude)]);

	var img = new Image();

	$(img).load(function() {
		e.find('.content').append(img);
		$('.map').append(e);
		e.addClass('visible');
		window.setTimeout(function() {
			e.addClass('disappearing');
		}, 2000);
		window.setTimeout(function() {
			e.remove();
		}, 3000);
	});

	img.src = data.avatar;
};


// Show a submitted entry on screen..
var entry = function(data) {
	var e = $(Mustache.to_html(entryTemplate, {}));
	e.css({
		top: latitudeAsPercent(data.latitude)+'%',
		left: longitudeAsPercent(data.longitude)+'%'
	});

	var entry = new Image();
	var avatar = new Image();

	avatar.width = entry.width = 90;

	var d1 = jQuery.Deferred(function(deferred) {
		$(entry).load(function() {
			deferred.resolve();
		});
	});

	var d2 = jQuery.Deferred(function(deferred) {
		$(avatar).load(function() {
			deferred.resolve();
		});
	});

	$.when(d1, d2).then(function() {
		e.find('.content').append(entry);
		e.find('.avatar').append(avatar);

		$('.map').append(e);
		e.addClass('visible');
		window.setTimeout(function() {
			e.addClass('disappearing');
		}, 4000);
		window.setTimeout(function() {
			e.remove();
		}, 6000);
	});

	entry.src = data.entry;
	avatar.src = data.avatar;
};


// Show a tweet on screen..
var tweet = function(data) {
	var e = $(Mustache.to_html(tweetTemplate, {}));

	e.css({
		top: latitudeAsPercent(data.latitude)+'%',
		left: longitudeAsPercent(data.longitude)+'%'
	});

	var avatar = new Image();

	$(avatar).load(function() {
		e.find('.avatar').append(avatar);
		e.find('.screenname').append(
			'<a rel="nofollow" href="http://twitter.com/'+
				twttr.txt.htmlEscape(data.tweet.user.screen_name)+'">'+
				twttr.txt.htmlEscape(data.tweet.user.screen_name)+'</a>');

		e.find('.text').prepend(twttr.txt.autoLink(data.tweet.text));

		$('.map').append(e);
		e.addClass('visible');

		// fix css positioning..
		e.find('.inner').css({ bottom: e.find('.inner').height() + 'px' });

		window.setTimeout(function() {
			e.addClass('disappearing');
		}, 4000);
		window.setTimeout(function() {
			e.remove();
		}, 6000);
	});

	avatar.src = data.tweet.user.profile_image_url;
};



var socket = io.connect();
socket.on('event', function (data) {
	var obj = JSON.parse(data);

	if (obj.type === 'login') {
		window.setTimeout(function() {
			login(obj);
		}, Math.random() * 50000);
	} else if (obj.type === 'entry') {
		window.setTimeout(function() {
			entry(obj);
		}, Math.random() * 50000);
	} else if (obj.type === 'tweet') {
		tweet(obj);
	}
});


// --

var latitudeAsPercent = function(lat) {
	return ((-lat + 90) / 180) * 100;
};

var longitudeAsPercent = function(long) {
	return ((long + 180) / 360) * 100;
};
