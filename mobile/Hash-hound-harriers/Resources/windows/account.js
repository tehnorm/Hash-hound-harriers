Ti.include('../hhh.js');

currentWindow.title = 'Account Details';



var greeting = Titanium.UI.createLabel({
        color:'#fff',
        text:'Welcome to HHH',
        top:10,
	textAlign: 'center',
        font : {fontSize : 48},
	width:'auto',
        height:'auto'
});
currentWindow.add(greeting);

var userName = Titanium.UI.createLabel({
        color:'#fff',
        text:'What is your username?',
        top:185,
        left:30,
        width:200,
        height:'auto'
});
currentWindow.add(userName);

var userNameField = Titanium.UI.createTextField({
        hintText:'enter username',
        height:35,
        top:210,
        left:30,
        width:250,
        borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});
currentWindow.add(userNameField);

//
// CREATE BUTTON
//
var save = Titanium.UI.createButton({
        title:'Get Started',
        top:260,
        left:30,
        height:30,
        width:250
});


save.addEventListener('click', function(e) {

	if(validUser()){
		alert('already a user - you can play!');
		return;
	}
	userNameField.blur();	

	uname = userNameField.value ;

	//
	// TODO: really hookup to the API
	//

	Ti.App.Properties.setString('username', uname);
	hhh.setProperty('user', {id : 12323, 'username' : uname});
	Ti.App.fireEvent('close_account_window');
	Ti.App.fireEvent('show_main_window');

/*
	var xhr = Titanium.Network.createHTTPClient();
	xhr.onload = function(){
		Ti.API.log('log',this);
		Ti.API.log('log',this.responseText);
		Ti.API.log('log',this.responseData);
		Ti.API.log('log',this.status);

		try{
			r = JSON.parse(this.responseText);
		} catch (err) {
			alert('No results found');
			return ;
		}
		Ti.API.log('log',r);

		hhh.setProperty('user', r);
		alert('You are ready to play!');

	};
	var url = hhh.getProperty('app.host') + '/user';
*/
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
/*
        // send the data
	var data = { 
		'device-id' : Titanium.Platform.createUUID(),
		'current-loc' : hhh.getProperty('gps'),
		name : uname,
		email : '' 
	};
        
	xhr.open('POST', url);
	xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
*/
});

currentWindow.add(save);
