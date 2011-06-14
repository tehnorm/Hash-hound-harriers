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
        if(u.id !== undefined){
                return true;
        }
	return false;
};

function getTitleForType(type) {
	switch(type) {
		case "startpoint": return "Start Point";
		case "checkpoint": return "Checkpoint";
		case "arrow": return "Arrow";
		case "falsepoint": return "False Point";
		case "endpoint": return "End Point";
		default: return "Checkpoint";
	}
}

function getColorForType(type) {
	switch(type) {
		case "startpoint": return Titanium.Map.ANNOTATION_GREEN;
		case "checkpoint": return Titanium.Map.ANNOTATION_GREEN;
		case "arrow": return Titanium.Map.ANNOTATION_PURPLE;
		case "falsepoint": return Titanium.Map.ANNOTATION_RED;
		case "endpoint": return Titanium.Map.ANNOTATION_GREEN;
		default: return Titanium.Map.ANNOTATION_GREEN;
	}
}

function addPinToMap(map_view, point) {
	var location = point.loc;

	var pin = Titanium.Map.createAnnotation({
		latitude: location.latitude,
		longitude: location.longitude,
		title: getTitleForType(point.type),
		subtitle: point["user-action"],
		pincolor: getColorForType(point.type),
		animate: true
	});

	map_view.addAnnotation(pin);
}

var createPoint = function(type, mainMapView){

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
		left: 0
//		annotations:[compassPin]
	});

	mapView.addEventListener('touchstart', function(){
		return false;
	});

	var arrow = Titanium.UI.createImageView({
		image: Titanium.Filesystem.resourcesDirectory + '/arrow.png',
		height:32,
		width:32,
		left:139,
		top:75
	});


        // Updates when the heading changes
	var rotateArrow = function(heading) {

		var t3 = Ti.UI.create2DMatrix();
		t3 = t3.rotate(heading);

		var a = Titanium.UI.createAnimation();
		a.transform = t3;
		a.duration = 1;
		a.autoreverse = false;
		a.repeat = 0;
		a.delay = 0;
		arrow.animate(a);
	        hhh.setProperty('heading', heading);

	};


        Titanium.Geolocation.showCalibration = false;
        Titanium.Geolocation.headingFilter = 90;
 
        Ti.Geolocation.getCurrentHeading(function(e)
        {
            if (e.error)
            {
                currentHeading.text = 'error: ' + e.error;
                return;
            }
            var x = e.heading.x;
            var y = e.heading.y;
            var z = e.heading.z;
            var magneticHeading = e.heading.magneticHeading;
            var accuracy = e.heading.accuracy;
            var trueHeading = e.heading.trueHeading;
            var timestamp = e.heading.timestamp;
 
            Titanium.API.info('geo - current heading: ' + trueHeading);
		rotateArrow(trueHeading);
        });
 
        Titanium.Geolocation.addEventListener('heading',function(e)
        {
            if (e.error)
            {
                Titanium.API.info("error: " + e.error);
                return;
            }
 
            var x = e.heading.x;
            var y = e.heading.y;
            var z = e.heading.z;
            var magneticHeading = e.heading.magneticHeading;
            var accuracy = e.heading.accuracy;
            var trueHeading = e.heading.trueHeading;
            var timestamp = e.heading.timestamp;
 
            Titanium.API.info('geo - heading updated: ' + trueHeading);
		rotateArrow(trueHeading);
        });




	
	// Input boxes
	var detailsInput = Titanium.UI.createTextField({
		color:'#336699',
		height:35,
		top:200,
		left:22,
		width:260,
		hintText : 'Checkpoint Hint',
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	var detailsSave = Titanium.UI.createButton({
		title: 'Add Checkpoint',
		height:35,
		top:240,
		left:22,
		width:260,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});


	detailsSave.addEventListener('click', function(e){
		// send the data
		var geo = hhh.getProperty('gps');
		var data = {
			'type' : type,
			'loc' : {'latitude' : geo.latitude, 'longitude' : geo.longitude},
			'direction' : hhh.getProperty('heading'),
			'user-action' : detailsInput.value,
			'game-id' : hhh.getProperty('game.id')
		};
		var point = data;
	        var url = hhh.getProperty('app.host') + '/game/point';
	        var xhr = Titanium.Network.createHTTPClient();

		xhr.onload = function() {
			Ti.API.log('log',this);
			Ti.API.log('log',this.responseText);
			Ti.API.log('log',this.responseData);
			Ti.API.log('log',this.status);

			if(this.status == 200){
				addPinToMap(mainMapView, point);
			}else{
				alert('Cound not create point');
			}
			return ;

		};

		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.open('POST', url);
		xhr.send(JSON.stringify(data));

		that.close();
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

var createPicker = function(win, callback){


      	var xhr = Titanium.Network.createHTTPClient();
        xhr.onload = function(){
		var pickerView = Titanium.UI.createView({height:248,bottom:0});
		var picker = Titanium.UI.createPicker({top:0, useSpinner:true});
		picker.selectionIndicator=true;

                Ti.API.log('log',this);
                Ti.API.log('log',this.responseText);
                Ti.API.log('log',this.responseData);
                Ti.API.log('log',this.status);

                try{
                        values = JSON.parse(this.responseText);
                } catch (err) {
                        alert('No active Games');
                        return ;
                }
                Ti.API.log('log',values);

		pickerValues = [];
		for (var i = 0; i < values.length; i++) {
                Ti.API.log('log',values[i].name);
                Ti.API.log('log',values[i].id);
                
			pickerValues[i] = Titanium.UI.createPickerRow({ 'title' : values[i].name});
		}

		var cancel =  Titanium.UI.createButton({
			title:'Cancel',
			style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
		});
		cancel.addEventListener('click',function(e) {
			pickerView.hide();
			win.remove(pickerView);
			iCanHazPicker = false;
			win.remove(toolbar);
		});

		var done =  Titanium.UI.createButton({
			title:'Choose',
			style:Titanium.UI.iPhone.SystemButtonStyle.DONE
		});
		done.addEventListener('click',function(e) {
			id = values[currentIndex].id;
			title = picker.getSelectedRow(0).title;
			hhh.setProperty('hound.game.id', id);
			pickerView.hide();
			win.remove(pickerView);
			win.remove(toolbar);
			Ti.App.fireEvent(callback);
			currentWindow.close();
		});

		var currentIndex = 0;
		picker.addEventListener('change', function(e){
			currentIndex = e.rowIndex;
		});

		var spacer =  Titanium.UI.createButton({
			systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
		});

		var toolbar =  Titanium.UI.createToolbar({
			top:170,
			items:[cancel,spacer,done]
		});

		picker.add(pickerValues);
		win.add(toolbar);
		pickerView.add(picker);
		win.add(pickerView);
		picker.show();
		pickerView.show();

        };
        var url = hhh.getProperty('app.host') + '/game/list_active';
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.open('GET', url);
        xhr.send();
};

var EARTH_RADIUS = 6378137;	// meters

/**
 * Calculates the distance (in meters) between two geographic coordinates using a spherical approximation of the Earth
 */
var calculateGeoDistance = function(pointA, pointB) {
	var degreesToRadians = function(degrees) {
		return degrees * (Math.PI / 180);
	};

	var latA = degreesToRadians(pointA.latitude);
	var latB = degreesToRadians(pointB.latitude);
	var longA = degreesToRadians(pointA.longitude);
	var longB = degreesToRadians(pointB.longitude);

	var distance = EARTH_RADIUS * Math.acos((Math.sin(latA) * Math.sin(latB)) + (Math.cos(latA) * Math.cos(latB) * Math.cos(longB - longA)));
};
