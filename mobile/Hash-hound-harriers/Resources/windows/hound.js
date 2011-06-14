Ti.include('../hhh.js');

currentLoc = hhh.getProperty('gps');
//Ti.API.log(currentLoc);
gameDetails = hhh.getProperty('game.details');
//Ti.API.log(gameDetails);

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

/* TODO : hook this up as showing the proper details about a game
        if(!validUser()){
                alert('Use Account to create a user!');
                return;
        }

        houndGameId = hhh.getProperty('hound.game.id');
        Ti.API.log('log','houndgameid');
        Ti.API.log('log',houndGameId);
        if(houndGameId === null){
                alert('Enter a Game Number!');
                return;
        }

        // Find the game - if a valid game load the window
        var xhr = Titanium.Network.createHTTPClient();
        xhr.onload = function(){
                Ti.API.log('log',this);
                Ti.API.log('log',this.responseText);
                Ti.API.log('log',this.responseData);
                Ti.API.log('log',this.status);

                try{
                        r = JSON.parse(this.responseText);
                } catch (err) {
                        alert('No Game found');
                        return ;
                }
                Ti.API.log('log','Setting game details - hounds');
                Ti.API.log('log',r);

                hhh.setProperty('game.id', r.id);
                hhh.setProperty('hound.game.id', r.id);
                hhh.setProperty('game.details', r);

                var window = Titanium.UI.createWindow({
                        backgroundColor:'green',
                        url: './hound.js'
                });
                window.hhh = hhh;
                window.open({fullscreen:true});

        };
        var url = hhh.getProperty('app.host') + '/game/' + houndGameId;
        xhr.open('GET', url);
        xhr.send();
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
	loc : {	
		latitude : gameDetails.loc.latitude,
		longitude : gameDetails.loc.longitude
	},
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

var houndPolling = function(){
        var xhr = Titanium.Network.createHTTPClient();
        
        var url = hhh.getProperty('app.host') + '/user/check_location';

        xhr.onload = function(){
                //Ti.API.log(this);
                //Ti.API.log(this.responseText);
                //Ti.API.log(this.responseData);
                //Ti.API.log(this.status);

                if(this.status != 200){
                        alert('Server com issue.');
                        return;
                }

                try {
                        r = JSON.parse(this.responseText);
                } catch (err) {
		//	alert(err);
                        return ;
                }

                // We got points back add them.
		addPinToMap(map_view, r);
		Titanium.Media.vibrate();
		alert('Point Found: (' + r.type + ') ' + r['user-action']);
                //Ti.API.log(r);


        };
        xhr.open('POST', url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        game_id = hhh.getProperty('hound.game.id');
        user = hhh.getProperty('user');
        var geo = hhh.getProperty('gps');
        var latitude = geo.latitude;
        var longitude = geo.longitude;
        data = {
                'game-id' :  game_id,
                 "loc": {"latitude": latitude, "longitude": longitude },
                'user-id' : user.id
        };

        //Ti.API.log(data);
        //Ti.API.log(url);

        xhr.send(JSON.stringify(data));

};


var timer = setInterval(function(e){
	//Ti.API.log('polling for points');
	houndPolling();	
}, 20000);
