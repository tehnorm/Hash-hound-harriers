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
                latitudeDelta : 0.01,
		longitudeDelta : 0.01
        },
        animate:true,
        regionFit:true,
        userLocation:true,
        annotations:[biz_pin]
});

currentWindow.add(map_view);


var label = Titanium.UI.createButton({
	title:'You are a Hound',
	color:'#fff',
	style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
});

var flexSpace = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});
var closeButton = Titanium.UI.createButton({
	title:'Close',
	style:Titanium.UI.iPhone.SystemButtonStyle.DONE
});

var w = Titanium.UI.createWindow({
	backgroundColor:'#336699'
});
closeButton.addEventListener('click', function()
{
	Ti.API.info('IN HERE');
	currentWindow.close();
});

// create and add toolbar
var toolbar = Titanium.UI.createToolbar({
	items:[flexSpace,label, flexSpace,closeButton],
	top:0,
	borderTop:false,
	borderBottom:true
});
currentWindow.add(toolbar);


