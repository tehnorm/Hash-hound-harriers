Ti.include('../hhh.js');

currentWindow.title = 'Account Details';

var firstName = Titanium.UI.createLabel({
        color:'#fff',
        text:'First Name',
        top:10,
        left:30,
        width:100,
        height:'auto'
});

currentWindow.add(firstName);

var firstNameField = Titanium.UI.createTextField({
        hintText:'enter first name',
        height:35,
        top:35,
        left:30,
        width:250,
        borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});

currentWindow.add(firstNameField);

//
//  CREATE FIELD TWO
//
var lastName = Titanium.UI.createLabel({
        color:'#fff',
        text:'Last Name',
        top:75,
        left:30,
        width:100,
        height:'auto'
});

currentWindow.add(lastName);

var lastNameField = Titanium.UI.createTextField({
        hintText:'enter last name',
        height:35,
        top:100,
        left:30,
        width:250,
        borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});

currentWindow.add(lastNameField);

//
// CREATE BUTTON
//
var save = Titanium.UI.createButton({
        title:'Save my Details',
        top:170,
        left:30,
        height:30,
        width:250
});


save.addEventListener('click', function(e)
{

	if(validUser()){
		alert('already a user - you can play!');
		return;
	}

	fname = firstNameField.value ;
	lname = lastNameField.value ;
	Ti.API.log(fname);
	Ti.API.log(lname);
	var xhr = Titanium.Network.createHTTPClient();
	xhr.onload = function(){
		Ti.API.log(this);
		Ti.API.log(this.responseText);
		Ti.API.log(this.responseData);
		Ti.API.log(this.status);

		try{
			r = JSON.parse(this.responseText);
		} catch (err) {
			alert('No results found');
			return ;
		}
		Ti.API.log(r);

		hhh.getProperty('user', r);
		alert('You are ready to play!');

	};
	var url = hhh.getProperty('app.host') + '/user';
/*
{ 
	device-id : 123123,
	current-loc : {
		lat :
		lng :
	},
	name : 'asd',
	email : 'asdasdf@adsf.com'
}
*/
        // send the data
	var data = { 
		'device-id' : Ti.App.id,
		'current-loc' : hhh.getProperty('gps'),
		name : fname + ' ' + lname,
		email : '' 
	};
        xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.open('POST', url);
        xhr.send(JSON.stringify(data));

});

currentWindow.add(save);
