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
