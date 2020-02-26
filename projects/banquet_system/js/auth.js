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

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		// User is signed in.
		displayName = user.displayName;
		adminEmail = user.email;
		emailVerified = user.emailVerified;
		photoURL = user.photoURL;
		isAnonymous = user.isAnonymous;
		uid = user.uid;
		providerData = user.providerData;
		document.getElementById('admin-email').innerText =  '['+adminEmail+'] Logout';
		document.getElementById('manager-btn').setAttribute('onclick',"javascript: Logout();");
		// ...
	} else {
		// User is signed out.
		adminEmail='';
		alert('Administrator signed out.');
		/*var strUrl=window.location.href;
		var arrUrl=strUrl.split("/");
		var strPage=arrUrl[arrUrl.length-1];
		if(strPage!='admin-login.html'){
			alert('Administrator signed out.');
			self.location='index.html';
		}*/
		//loginPageCheck();
		self.location='index.html';
	}
});

function loginPageCheck(){
	var strUrl=window.location.href;
	var arrUrl=strUrl.split("/");
	var strPage=arrUrl[arrUrl.length-1];
	if(strPage!='admin-login.html'){
		self.location='index.html';
	}
}

function Logout(){
	//alert("logout");
	firebase.auth().signOut().then(function() {
		// Sign-out successful.
	}).catch(function(error) {
		// An error happened.
	});
}
