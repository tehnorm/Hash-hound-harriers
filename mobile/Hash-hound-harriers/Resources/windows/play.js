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


	// Create the game and put the hound into it 
        var xhr = Titanium.Network.createHTTPClient();
        xhr.onload = function(){
                Ti.API.log(this);
                Ti.API.log(this.responseText);
                Ti.API.log(this.responseData);
                Ti.API.log(this.status);

                try{
                        r = JSON.parse(this.responseText);
                } catch (err) {
                        alert('Could not create game');
//                        return ;
                }
 //               Ti.API.log(r);

		// TODO - add real API values
     //           hhh.setProperty('game.id', r);
      //          hhh.setProperty('game.details', r);

		var window = Titanium.UI.createWindow({
			backgroundColor:'red',
			url: './hare.js'
		});
		window.hhh = hhh;
		window.open({fullscreen:true});

        };
        var url = hhh.getProperty('app.host') + '/game';
        xhr.open('POST', url);
        xhr.send();


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

var gameNumber = Titanium.UI.createTextField({
        hintText:'Game Number',
        height:35,
        top:120,
        left:30,
        width:250,
        borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
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

	if(gameNumber.value.length == 0){
                alert('Enter a Game Number!');
                return;
	}

	// Find the game - if a valid game load the window
        var xhr = Titanium.Network.createHTTPClient();
        xhr.onload = function(){
                Ti.API.log(this);
                Ti.API.log(this.responseText);
                Ti.API.log(this.responseData);
                Ti.API.log(this.status);

                try{
                        r = JSON.parse(this.responseText);
                } catch (err) {
                        alert('No Game found');
                        return ;
                }
                Ti.API.log(r);

		// TODO - add real API values
                hhh.setProperty('game.id', r);
                hhh.setProperty('game.details', r);

		var window = Titanium.UI.createWindow({
			backgroundColor:'green',
			url: './hound.js'
		});
		window.hhh = hhh;
		window.open({fullscreen:true});

        };
        var url = hhh.getProperty('app.host') + '/game/' + gameNumber.value;
        xhr.open('GET', url);
        xhr.send();

	
});

currentWindow.add(join);
currentWindow.add(gameNumber);

