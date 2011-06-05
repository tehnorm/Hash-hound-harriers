Ti.include('../hhh.js');

currentWindow.title = 'Hash Hound Harriers';

// Start game
var start = Titanium.UI.createButton({
        title:'Start New Game',
        top:50,
        left:30,
        height:30,
        width:250
});

start.addEventListener('click', function(e)
{
	Ti.API.info('start clicked');

	if(!validUser()){
                alert('Use Account to create a user!');
                return;
	}


	// Create the game  
        var xhr = Titanium.Network.createHTTPClient();
        xhr.onload = function(){
                Ti.API.log('log',this);
                Ti.API.log('log',this.responseText);
                Ti.API.log('log',this.responseData);
                Ti.API.log('log',this.status);

                try{
                        r = JSON.parse(this.responseText);
			// Put the hound into it
                } catch (err) {
                        alert('Could not create game');
                        return ;
                }
                Ti.API.log('log','setting game object');
                Ti.API.log('log',r);

                hhh.setProperty('game.id', r.id);
                hhh.setProperty('game.details', r);

		var window = Titanium.UI.createWindow({
			backgroundColor:'red',
			url: './hare.js'
		});
		window.hhh = hhh;
		window.open({fullscreen:true});

        };
        var url = hhh.getProperty('app.host') + '/game';
        
        user = hhh.getProperty('user');
        xhr.open('POST', url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send('{ "name" : "", "hare-id" : "' + user.id  + '"}');


});

currentWindow.add(start);


// OR label
var orLabel = Titanium.UI.createLabel({
        text:'OR',
        top:85,
	textAlign: 'center',
        height:30,
	color: '#fff',
        width:250
});
currentWindow.add(orLabel);

// Join Game

var gameNumber = Titanium.UI.createLabel({
        text:'   Choose Game',
        height:35,
        top:120,
        left:30,
        width:250,
	color: '#A09D9D',
	borderRadius: 5,
	borderColor: '#DDD',
	borderWidth: 1,
	backgroundColor: '#fff'
});

gameNumber.addEventListener('click', function(){
	
	createPicker(currentWindow, gameNumber);

});

var join = Titanium.UI.createButton({
        title:'Join Game',
        top:160,
        left:30,
        height:30,
        width:250
});

join.addEventListener('click', function(e)
{
	Ti.API.info('join clicked');

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

	
});

currentWindow.add(join);
currentWindow.add(gameNumber);

