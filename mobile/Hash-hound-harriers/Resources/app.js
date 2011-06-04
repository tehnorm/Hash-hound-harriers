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
			'accuracy': 1232
		},
		'heading' : 90 ,
		'user' : {
			/*
			 * user.id 
			 * user.name
			 * user.first_name
			 * user.last_name
			 * user.link
			 * user.gender
			 * user.locale
			 */
		}
	};

	var data = {};

	data.getProperty = function(name) {
		Ti.API.log('getting Prop ' + name + ' value ' + properties[name]);	
		return properties[name];
	};

	data.setProperty = function(name, value) {
		Ti.API.log('setting Prop ' + name + ' Value ' + value);	
		properties[name] = value;
	};

	data.append = function(name, value) {
		Ti.API.log('appending Prop ' + name + ' Value ' + value);	
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

hhh.setProperty('app.js', 'testing');
insync = hhh; // TODO: remove. confusing.

/**
 * this sets the background color of the master
 * UIView (when there are no windows/tab groups on it)
 */
Titanium.UI.setBackgroundColor('#000');

///////////////////////////////////////////
// TABS 
///////////////////////////////////////////

// Near 
var playWindow = Titanium.UI.createWindow({  
	backgroundColor:'#fff',
	url:'windows/play.js'
});

playWindow.hhh = hhh;

var playTab = Titanium.UI.createTab({  
	icon:Titanium.Filesystem.resourcesDirectory + '/img/buttons/tabs/map.png',
	title:'Play',
	window:playWindow
});

playTab.addEventListener('blur', function(e) {
//	Ti.App.fireEvent('hide_indicator');
});

playTab.addEventListener('focus', function(e) {
//	e.tab.window.fireEvent('start_near_search');
//	Ti.App.fireEvent('show_indicator');
});

// Account Tab 
var accountWindow = Titanium.UI.createWindow({  
	backgroundColor:'#fff',
	url:'windows/account.js'
});

accountWindow.insync = insync;

var accountTab = Titanium.UI.createTab({  
	icon:Titanium.Filesystem.resourcesDirectory + '/img/buttons/tabs/settings.png',
	title:'Account',
	window:accountWindow
});

accountTab.addEventListener('blur', function(e) {
	Ti.API.info('account - blur');
});

accountTab.addEventListener('focus', function(e) {
	Ti.API.info('account - focus');
	e.tab.window.fireEvent('window_focus');
});


// Info Tab 
var infoWindow = Titanium.UI.createWindow({  
	backgroundColor:'#fff',
	url:'windows/info.js'
});

infoWindow.insync = insync;

var infoTab = Titanium.UI.createTab({  
	icon:Titanium.Filesystem.resourcesDirectory + '/img/buttons/tabs/settings.png',
	title:'Info',
	window:infoWindow
});

infoTab.addEventListener('blur', function(e) {
	Ti.API.info('info - blur');
});

infoTab.addEventListener('focus', function(e) {
	Ti.API.info('info - focus');
	e.tab.window.fireEvent('window_focus');
});

/**
 *   add tabs
 */
var tabGroup = Titanium.UI.createTabGroup();

tabGroup.addTab(playTab);  
tabGroup.addTab(infoTab);  
tabGroup.addTab(accountTab);  

// open tab group
tabGroup.open();
tabGroup.setActiveTab(0);
Ti.App.fireEvent('hide_indicator');


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
//		return handle_gps_update(e);
	});

	// Updates when the location changes
	Titanium.Geolocation.addEventListener('location',function(e) {
		Ti.API.info('GPS location event: ');
//		return handle_gps_update(e);
	});

	// Updates when the heading changes
	Titanium.Geolocation.addEventListener('heading ',function(e) {
		Ti.API.info('Heading event: ');
//		return handle_heading_update(e);
	});
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
