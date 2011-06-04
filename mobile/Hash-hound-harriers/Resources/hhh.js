// Lib file for helpers and what not


// Included windows need to have the global key/val store 
currentWindow = Titanium.UI.currentWindow;
if(currentWindow){
        hhh = currentWindow.hhh;
	currentWindow.backgroundColor = '#000000';
	currentWindow.barColor = '#000000';
}else{
        hhh = hhh;
}


var gameInProgress = function(){
        currentGame = hhh.getProperty('game.started');
        if(currentGame == null || currentGame == 0 || currentGame == false){
                return false;
        }
        return true;
}

var pad = function(number, length) {
   
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
   
    return str;

}

