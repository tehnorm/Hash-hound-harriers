Ti.include('../hhh.js');

currentLoc = hhh.getProperty('gps');
Ti.API.log(currentLoc);

var biz_pin = Titanium.Map.createAnnotation({
        latitude : currentLoc.latitude,
        longitude : currentLoc.longitude,
        title :'Test Point',
        subtitle :'Some details about this point',
        pincolor : Titanium.Map.ANNOTATION_RED,
        animate : true
});

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
        userLocation:true,
        annotations:[biz_pin]
});

currentWindow.add(map_view);

///////////////////////////////////
// Game Number 
//////////////////////////////////

var gameNumber = Titanium.UI.createLabel({
	text: hhh.getProperty('game.id'),
	color:'#fff',
	backgroundColor:'black',
	style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
	'font-size': 7,
	height: 20,
	width: 60,
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
	Ti.API.info('IN HERE');
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
		// Grab the current cords
		// Start the game  
		// TODO: TIE TO SERVER /POST /game/start/game_id
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



var flexSpace = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});

closeButton.addEventListener('click', function()
{
	Ti.API.info('IN HERE');
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
