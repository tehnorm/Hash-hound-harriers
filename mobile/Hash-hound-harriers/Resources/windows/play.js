Ti.include('../hhh.js');

currentWindow.title = 'Play Game!';

// Start game
var start = Titanium.UI.createButton({
        title:'Start New Game',
        top:70,
        left:30,
        height:30,
        width:250
});

start.addEventListener('click', function(e)
{
	Ti.API.info('start clicked');
});

currentWindow.add(start);

// Join Game

var gameNumber = Titanium.UI.createTextField({
        hintText:'Game Number',
        height:35,
        top:170,
        left:30,
        width:250,
        borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});

var join = Titanium.UI.createButton({
        title:'Join Game',
        top:210,
        left:30,
        height:30,
        width:250
});

join.addEventListener('click', function(e)
{
	Ti.API.info('join clicked');
});

currentWindow.add(join);
currentWindow.add(gameNumber);

