Ti.include('../hhh.js');

currentLoc = hhh.getProperty('gps');
Ti.API.log('log',currentLoc);
/*
var biz_pin = Titanium.Map.createAnnotation({
        latitude : currentLoc.latitude,
        longitude : currentLoc.longitude,
        title :'Test Point',
        subtitle :'Some details about this point',
        pincolor : Titanium.Map.ANNOTATION_RED,
        animate : true
});
*/

var map_view = Titanium.Map.createView({        
	mapType: Titanium.Map.STANDARD_TYPE,
        region: {
	        latitude : currentLoc.latitude,
	        longitude : currentLoc.longitude,
                latitudeDelta : 0.001,
		longitudeDelta : 0.001
        },
        animate:true,
        regionFit:true,
        userLocation:true
});

currentWindow.add(map_view);

///////////////////////////////////
// Game Number 
//////////////////////////////////

var game = hhh.getProperty('game.details');
var gameName = game.name;

var gameNumber = Titanium.UI.createLabel({
	text: gameName,
	color:'#fff',
	backgroundColor:'black',
	style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
	'font-size': 7,
	height: 20,
	width: 240,
	top: 40,
	left: 0
});
currentWindow.add(gameNumber);

///////////////////////////////////
// TOP TOOLBAR
//////////////////////////////////
var startButton = Titanium.UI.createButton({
	title:'Start',
	style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
});

var label = Titanium.UI.createButton({
	title:'Get Ready....',
	color:'#fff',
	style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
});

var flexSpace = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE,
	style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
});
var closeButton = Titanium.UI.createButton({
	title:'Close',
	style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
});

var w = Titanium.UI.createWindow({
	backgroundColor:'#336699'
});

closeButton.addEventListener('click', function()
{
	currentWindow.close();
});

startButton.addEventListener('click', function()
{

	Ti.API.info(gameInProgress());
	if(gameInProgress() === true){
		// Game alrady started
		Ti.API.info('game started');
		return '';
	}else{
		Ti.API.info('game not started');
		startButton.title = '15:00';
		label.title = 'Counting down!';
		// Start the game  /POST /game/start/game_id
	        var xhr = Titanium.Network.createHTTPClient();
		
	        var url = hhh.getProperty('app.host') + '/game/start';
		xhr.onload = function(){
			Ti.API.log('log',this);
			Ti.API.log('log',this.responseText);
			Ti.API.log('log',this.responseData);
			Ti.API.log('log',this.status);

			try{
				r = JSON.parse(this.responseText);
			} catch (err) {
				alert('Could not start game.');
				return ;
			}

			// Add game details to the system
                	hhh.setProperty('game.details', r);

			Ti.API.log('log',r);


		};
		xhr.open('POST', url);
		xhr.setRequestHeader('Content-Type', 'application/json');
		game_id = hhh.getProperty('game.id');
		var geo = hhh.getProperty('gps');
		var latitude = geo.latitude;
		var longitude = geo.longitude;
		data = '{"game_id" : "' +  game_id + '", "loc": {"latitude": "' + latitude + '", "longitude": "' + longitude + '"}}';
		Ti.API.log('log',data);
		Ti.API.log('log',url);

		xhr.send(data);


		// Add the start point	
	        
		xhr.setRequestHeader('Content-Type', 'application/json');
	        url = hhh.getProperty('app.host') + '/game/point';
		xhr.onload = function(){
			Ti.API.log('log',this);
			Ti.API.log('log',this.responseText);
			Ti.API.log('log',this.responseData);
			Ti.API.log('log',this.status);

			if(this.status != 200){
				alert('Could place initial point.');
				return ;
			}
		};
		xhr.open('POST', url);
		xhr = Titanium.Network.createHTTPClient();
		// Grab the current cords
		geo = hhh.getProperty('gps');
		data = {
			'type' : 'startpoint',
			'loc' : {'latitude' :  geo.latitude, 'longitude' : geo.longitude},
			'game-id' : game_id,
			'user-action' : 'Start Point!'
		};
		xhr.send(JSON.stringify(data));
		addPinToMap(map_view, data);
		
		// Set game as started
		hhh.setProperty('game.started', true);

		// Start the timer
		var mt = 0;	
		var minutes = 15;
		var timer = setInterval(function(e){
			mt++;

			if(mt >= (minutes * 60)){
				clearInterval(timer);
				startButton.title = '00:00';
				label.title = 'Hounds are loose!';
			}else{
				//total seconds - current mins * 60 
				remaining = (minutes * 60) - mt;
				mins = Math.floor(remaining / 60);
				seconds = Math.round((((remaining / 60) - mins) * 60));
				startButton.title = mins + ':' + pad(seconds, 2);
			}
		}, 1000);
	}
});

var toolbar = Titanium.UI.createToolbar({
	items:[closeButton,flexSpace,label, flexSpace,startButton],
	top:0,
	borderTop:false,
	borderBottom:true
});
currentWindow.add(toolbar);

///////////////////////////////////
// BOTTOM TOOLBAR
//////////////////////////////////



var hhhButton = Titanium.UI.createButton({
	title:'HHH',
	style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
});
var checkPointButton = Titanium.UI.createButton({
	title:'(x)',
	style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
});
var arrowButton = Titanium.UI.createButton({
	title:'Arrow',
	style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
});
var badTrailButton = Titanium.UI.createButton({
	title:'BT',
	style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
});

// Button Events
hhhButton.addEventListener('click', function(){
	var v = new createPoint('endpoint', map_view);
});
checkPointButton.addEventListener('click', function(){
	var v = new createPoint('checkpoint', map_view);
});
arrowButton.addEventListener('click', function(){
	var v = new createPoint('arrow', map_view);
});
badTrailButton.addEventListener('click', function(){
	var v = new createPoint('falsepoint', map_view);
});


var flexSpace = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});

closeButton.addEventListener('click', function()
{
	currentWindow.close();
});

// create and add toolbar
var bottomToolbar = Titanium.UI.createToolbar({
	items:[hhhButton,flexSpace,checkPointButton,flexSpace,arrowButton,flexSpace,badTrailButton],
	bottom:0,
	borderTop:true,
	borderBottom:false
});
currentWindow.add(bottomToolbar);

