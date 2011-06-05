Ti.include('../hhh.js');

currentLoc = hhh.getProperty('gps');
Ti.API.log(currentLoc);
gameDetails = hhh.getProperty('game.details');
Ti.API.log(gameDetails);

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
		latitude : gameDetails.loc.latitude,
		longitude : gameDetails.loc.longitude,
                latitudeDelta : 0.01,
		longitudeDelta : 0.01
        },
        animate:true,
        regionFit:true,
        userLocation:true
});

currentWindow.add(map_view);

startPoint = {
	latitude : gameDetails.loc.latitude,
	longitude : gameDetails.loc.longitude,
	type : 'startpoint',
	'user-action' : 'Start Point!'
};
addPinToMap(map_view, startPoint);


///////////////////////////////////
// TOOLBAR UI 
//////////////////////////////////

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




///////////////////////////////////
// POLLING FOR PINS 
//////////////////////////////////

var harePolling = function(){
        var xhr = Titanium.Network.createHTTPClient();
        xhr.setRequestHeader('Content-Type', 'application/json');
        var url = hhh.getProperty('app.host') + '/user/check_location';
        xhr.onload = function(){
                Ti.API.log(this);
                Ti.API.log(this.responseText);
                Ti.API.log(this.responseData);
                Ti.API.log(this.status);

                if(this.status != 200){
                        alert('Server com issue.');
                        return;
                }

                try {
                        r = JSON.parse(this.responseText);
                } catch (err) {
                        return ;
                }

                // We got points back add them.
		addPinToMap(map_view, r);
		Titanium.Media.vibrate();
		alert('Point Found: (' + r.type + ') ' + r['user-action']);
                Ti.API.log(r);


        };
        xhr.open('POST', url);
        game_id = hhh.getProperty('hare.game.id');
        user = hhh.getProperty('user');
        var geo = hhh.getProperty('gps');
        var latitude = geo.latitude;
        var longitude = geo.longitude;
        data = {
                'game_id' :  game_id,
                 "loc": {"latitude": latitude, "longitude": longitude },
                'user-id' : user.id
        };

        Ti.API.log(data);
        Ti.API.log(url);

        xhr.send(JSON.stringify(data));

}();
