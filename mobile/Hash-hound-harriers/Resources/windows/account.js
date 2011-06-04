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
        Ti.API.info('save clicked');
});

currentWindow.add(save);
