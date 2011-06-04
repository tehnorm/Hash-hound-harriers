Ti.include('../hhh.js');

var biz_pin = Titanium.Map.createAnnotation({
        latitude:insyncLocation.loc.lat,
        longitude:insyncLocation.loc.lng,
        title:insyncLocation.name,
        subtitle:insyncLocation.address2,
        pincolor:Titanium.Map.ANNOTATION_RED,
        animate:true
});

var map_view = Titanium.Map.createView({        
	mapType: Titanium.Map.STANDARD_TYPE,
        region: {
                latitude:insyncLocation.loc.lat,
                longitude:insyncLocation.loc.lng,
                latitudeDelta:0.01, longitudeDelta:0.01
        },
        animate:true,
        regionFit:true,
        userLocation:true,
        annotations:[biz_pin]
});

