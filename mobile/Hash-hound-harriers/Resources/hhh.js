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
};

var pad = function(number, length) {
   
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
   
    return str;

};

var validUser = function(){
        u = hhh.getProperty('user');
        if(u._id !== undefined){
                return true;
        }
	return false;
};

var createPoint = function(type){

	var that = {};

	if(hhh.getProperty('creating-point') === true){
		return;
	}

	// Window setup
        createPointWin = Titanium.UI.createWindow({
                backgroundColor:'#fff',
                modal:false
        });

        createPointView = Titanium.UI.createView({
                height:470,
                width:310,
                backgroundColor:'#333',
                borderRadius:10,
                borderColor: 'gray',
                borderWidth: 1.0,
                borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
        });

	// Direction Buttons
	var compassPin = Titanium.Map.createAnnotation({
		latitude : currentLoc.latitude,
		longitude : currentLoc.longitude,
		title :'Test Point',
		subtitle :'Some details about this point',
		pincolor : Titanium.Map.ANNOTATION_RED,
		animate : true
	});

	var mapView = Titanium.Map.createView({
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
		touchEnable: false,
		focusable : false,
		size: {width: 310, height: 170},
		top: 0, 
		left: 0,
		annotations:[compassPin]
	});

	mapView.addEventListener('touchstart', function(){
		return false;
	});

	var arrow = Titanium.UI.createImageView({
		image: Titanium.Filesystem.resourcesDirectory + '/arrow.png',
		height:20,
		width:20,
		left:170,
		top:85
	});


        // Updates when the heading changes
        Titanium.Geolocation.addEventListener('heading ',function(e) {
                Ti.API.info('Heading event: ');

		var t3 = Ti.UI.create2DMatrix();
		t3 = t3.rotate(e.trueHeading);

		var a = Titanium.UI.createAnimation();
		a.transform = t3;
		a.duration = 1;
		a.autoreverse = true;
		a.repeat = 0;
		arrow.animate(a);

        });




	
	// Input boxes
	var detailsInput = Titanium.UI.createTextField({
		color:'#336699',
		height:35,
		top:200,
		left:22,
		width:250,
		hintText : 'Checkpoint Hint',
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	var detailsSave = Titanium.UI.createButton({
		title: 'Add Checkpoint',
		height:35,
		top:240,
		left:22,
		width:250,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});

	



        // Close button 
        closeButton = Titanium.UI.createButton({
                title : 'Close',
                top: 10,
                height: 20,
                width: 60
        });
        closeButton.addEventListener('click', function(e){
                Titanium.API.info("close button clicked");
                that.close();
        });


//        createPointView.add(ta1);
        createPointView.add(mapView);
        createPointView.add(detailsInput);
        createPointView.add(detailsSave);
        createPointView.add(closeButton);
        createPointView.add(arrow);
        createPointWin.add(createPointView);

        that.close = function(){
                createPointView.hide();
                createPointWin.hide();
                createPointWin.close();
        	hhh.setProperty('creating-point', false);
        };

        Ti.App.addEventListener('close-creating-point', function(e){
                that.close();
        });

        createPointWin.open();
        createPointView.show();
        hhh.setProperty('creating-point', true);


	// Send the results to the server	

	return that;
};
