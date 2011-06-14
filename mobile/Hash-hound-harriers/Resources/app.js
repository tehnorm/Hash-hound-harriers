Ti.include("version.js");

if(isIPhone3_2_Plus()) {
	// NOTE: starting in 3.2+, you'll need to set the applications
	// purpose property for using Location services on iPhone
	Ti.Geolocation.purpose = "hhh - location detection";
}

///////////////////////////////////////////
// PERSITANT KEY/VAL STORE 
///////////////////////////////////////////
var hhh = function(){

	/*
	 * gps.longitude
	 * gps.latitude
	 * gps.altitude
	 * gps.heading
	 * gps.accuracy
	 * gps.speed
	 * gps.timestamp
	 * gps.altitudeAccuracy
	 */

	var properties = {

		'app.host' : 'http://beta.innermesh.com',

		// Set sane defaults - keeps GPS happy in testing 
		'gps' : {
			'longitude': -78.8974838256836,
			'latitude': 35.998443603516055,
			'accuracy': 50 
		},
		'heading' : 90 ,
		'user' : {
			/*
			 * user.id : 1231232d33s2343
			 * user.name
			 * user.device-id
			 * user.email
			 * user.current-loc : {latitude, longitude}
			 */
		},
		'game.id' : 123123,
		'game.started' : false,
		'hare.game.id' : null,
		'game.details' : null
	};

	var data = {};

	data.getProperty = function(name) {
		Ti.API.log('log','getting Prop ' + name + ' value ' + properties[name]);
		return properties[name];
	};

	data.setProperty = function(name, value) {
		Ti.API.log('log','setting Prop ' + name + ' Value ' + value);
		properties[name] = value;
	};

	data.append = function(name, value) {
		Ti.API.log('log','appending Prop ' + name + ' Value ' + value);
		properties[name].push(value);
	};

	// Setup the global xhr builder - adds some logging goodness to all calls
	data.xhr = function(){
		var xhr = Ti.Network.createHTTPClient();
		return xhr;
	};

	data.epoc_to_utc = function( seconds ){
		var newDate = new Date();
		newDate.setTime( seconds*1000 );
		var dateString = newDate.toUTCString();
		return dateString;
	};


	return data;
}();
Ti.include("hhh.js");

/**
 * this sets the background color of the master
 * UIView (when there are no windows/tab groups on it)
 */
Titanium.UI.setBackgroundColor('#000');

///////////////////////////////////////////
// PAGES 
///////////////////////////////////////////

// Play 
var playWindow = Titanium.UI.createWindow({  
	backgroundColor:'#fff',
	url:'windows/play.js'
});

playWindow.hhh = hhh;

// Account Tab 
var accountWindow = Titanium.UI.createWindow({  
	backgroundColor:'#fff',
	url:'windows/account.js'
});
accountWindow.hhh = hhh;
Titanium.App.addEventListener('show_account_window', function(e) {
	Ti.API.info("Showing Account Window");
	accountWindow.open();
	accountWindow.show();
});
Titanium.App.addEventListener('close_account_window', function(e) {
	Ti.API.info("Closing Account Window");
	accountWindow.hide();
	accountWindow.close();
});

// Main Tab 
var mainWindow = Titanium.UI.createWindow({  
	backgroundColor:'#fff',
	url:'windows/main.js'
});
mainWindow.hhh = hhh;
Titanium.App.addEventListener('show_main_window', function(e) {
	Ti.API.info("Showing Main Window");
	mainWindow.open();
	mainWindow.show();
});
Titanium.App.addEventListener('close_main_window', function(e) {
	Ti.API.info("Closing Main Window");
	mainWindow.hide();
	mainWindow.close();
});

// Options Tab 
var optionsWindow = Titanium.UI.createWindow({  
	backgroundColor:'#fff',
	url:'windows/options.js'
});
optionsWindow.hhh = hhh;
Titanium.App.addEventListener('show_options_window', function(e) {
	Ti.API.info("Showing Options Window");
	optionsWindow.open();
	optionsWindow.show();
});
Titanium.App.addEventListener('close_options_window', function(e) {
	Ti.API.info("Closing Options Window");
	optionsWindow.hide();
	optionsWindow.close();
});

// Hound Tab 
var houndWindow = Titanium.UI.createWindow({  
	backgroundColor:'#fff',
	url:'windows/hound.js'
});
houndWindow.hhh = hhh;
Titanium.App.addEventListener('show_hound_window', function(e) {
	Ti.API.info("Showing Options Window");
	houndWindow.open();
	houndWindow.show();
});
Titanium.App.addEventListener('close_hound_window', function(e) {
	Ti.API.info("Closing Options Window");
	houndWindow.hide();
	houndWindow.close();
});

///////////////////////////////////////////
//  GPS & HEADING - HANDLERS 
///////////////////////////////////////////

var handle_gps_update = function(e){

	if (e.error) {
		Ti.API.error('GPS error: ' + JSON.stringify(e.error));
		return;
	}

	hhh.setProperty('gps', e.coords);

	Titanium.API.info('geo - current location: ' + new Date(e.coords.timestamp) + ' long ' + e.coords.longitude + ' lat ' + e.coords.latitude + ' accuracy ' + e.coords.accuracy);
	Ti.API.info('Heading info: ' + JSON.stringify(e));

};

var handle_heading_update = function(e){

	if (e.error) {
		Ti.API.error('Heading error: ' + JSON.stringify(e.error));
		return;
	}

	hhh.setProperty('heading', e.trueHeading);

	Ti.API.info('Heading info: ' + JSON.stringify(e));

};

if (Titanium.Geolocation.locationServicesEnabled==false) {
	Titanium.UI.createAlertDialog({title:'HHH', message:'Your device has geo turned off - turn it on.'}).show();
} else {
	Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
	Titanium.Geolocation.distanceFilter = '.01';

	// Updates once 
	Titanium.Geolocation.getCurrentPosition(function(e) {
		Ti.API.info('GPS one time: ');
		return handle_gps_update(e);
	});

	// Updates when the location changes
	Titanium.Geolocation.addEventListener('location',function(e) {
		Ti.API.info('GPS location event: ');
		return handle_gps_update(e);
	});

	// Updates when the heading changes
/*
	Titanium.Geolocation.addEventListener('heading ',function(e) {
		Ti.API.info('Heading event: ');
		return handle_heading_update(e);
	});
*/
}


///////////////////////////////////////////
//  CREATE CUSTOM LOADING INDICATOR
///////////////////////////////////////////

var indWin = null;
var actInd = null;

// window container
indWin = Titanium.UI.createWindow({
	height:150,
	width:150
});

// black view
var indView = Titanium.UI.createView({
	height:150,
	width:150,
	backgroundColor:'#000',
	borderRadius:10,
	opacity:0.8
});

indWin.add(indView);

// loading indicator
actInd = Titanium.UI.createActivityIndicator({
	style:Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
	height:30,
	width:30
});

indWin.add(actInd);

// message
var message = Titanium.UI.createLabel({
	text:'Loading',
	color:'#fff',
	width:'auto',
	height:'auto',
	font:{fontSize:20,fontWeight:'bold'},
	bottom:20
});

indWin.add(message);

function showIndicator() {
	indWin.open();
	actInd.show();
};

function hideIndicator() {
	actInd.hide();
	indWin.close({opacity:0,duration:500});
};

// Add global event handlers to hide/show custom indicator
Titanium.App.addEventListener('show_indicator', function(e) {
	Ti.API.info("IN SHOW INDICATOR");
	showIndicator();
});

Titanium.App.addEventListener('hide_indicator', function(e) {
	Ti.API.info("IN HIDE INDICATOR");
	hideIndicator();
});
	
Ti.App.fireEvent('hide_indicator');

///////////////////////////////////////////
//  INITIAL PAGE LOAD 
///////////////////////////////////////////
// TODO : remove when we really have this hooked up
Ti.App.Properties.setString('username', null);

username = Ti.App.Properties.getString('username');
Ti.API.log('info', username);
if(username === null){
	accountWindow.open();	
}else{
	mainWindow.open();	
}
