// Initialize Firebase
var config = {
	apiKey: "AIzaSyA7nsxerdiRCaYHMOi1ntCvv5GgAfqWd-s",
	authDomain: "banquet-system.firebaseapp.com",
	databaseURL: "https://banquet-system.firebaseio.com",
	projectId: "banquet-system",
	storageBucket: "banquet-system.appspot.com",
	messagingSenderId: "78359664414"
};
firebase.initializeApp(config);

var displayName;
var adminEmail='';
var emailVerified;
var photoURL;
var isAnonymous;
var uid;
var providerData;

function Login(){
	var email = document.getElementById('staff-id').value;
	var password = document.getElementById('password').value;
	//console.log(email+password);
	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		alert("[Error "+errorCode+'] '+errorMessage);
		self.location='admin-login.html';
		// ...
	});
	self.location='manage.html';
}

function Logout(){
	alert("logout");
	firebase.auth().signOut().then(function() {
		// Sign-out successful.
	}).catch(function(error) {
		// An error happened.
	});
}
