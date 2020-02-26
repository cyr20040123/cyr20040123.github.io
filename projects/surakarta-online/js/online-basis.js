var displayName;
var email;
var emailVerified;
var photoURL;
var isAnonymous;
var uid;
var providerData;

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		// User is signed in.
		displayName = user.displayName;
		email = user.email;
		emailVerified = user.emailVerified;
		photoURL = user.photoURL;
		isAnonymous = user.isAnonymous;
		uid = user.uid;
		providerData = user.providerData;
		document.getElementById("uid").innerText=email;
		document.getElementById("useronline").style.display="inline";
		document.getElementById("login-btn").style.display="none";
		document.getElementById("logout-btn").style.display="inline";
		// ...
	} else {
		// User is signed out.
		// ...
		document.getElementById("uid").innerText="null";
		document.getElementById("useronline").style.display="none";
		document.getElementById("login-btn").style.display="inline";
		document.getElementById("logout-btn").style.display="none";
	}
});

function readJSON(gameSnapshot){
    var tJson = {};
    gameSnapshot.forEach(function(keyvalues) {
        var childKey = keyvalues.key;
        var childData = keyvalues.val();
        tJson[keyvalues.key] = childData;
    });
    return tJson;
}