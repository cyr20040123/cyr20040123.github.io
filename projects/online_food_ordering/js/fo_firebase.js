// Initialize Firebase
var config = {
	apiKey: "AIzaSyDfGyMTztEo-z125olqA-Lowb6q_wjF0h0",
	authDomain: "foodordering-2121.firebaseapp.com",
	databaseURL: "https://foodordering-2121.firebaseio.com",
	projectId: "foodordering-2121",
	storageBucket: "foodordering-2121.appspot.com",
	messagingSenderId: "436635050618"
};
firebase.initializeApp(config);
var database = firebase.database();

//displayName, email, isAnonymous, uid
var current_user = null;
var user_data = null;
var cart = null;
firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		console.log("User logged in:"+user.uid+" "+user.email);
		current_user = user;
		database.ref("users/"+current_user.uid).on("value",function(snapshot) {
            user_data = snapshot.val();
            //console.log("User data: " + user_data["admin"]);
            if(user_data == null && GetFileName() != 'registerprofile.html'){
                alert("Please register your personal profile first.");
                window.location.href='./registerprofile.html?id='+user.uid;
            };
        });
        $("#login-btn").attr("onclick","firebase.auth().signOut();window.location.href = './index.php';");
        $("#login-btn").text("Sign Out");
        database.ref("carts/"+current_user.uid).on("value",function(snapshot) {
            cart = snapshot.val();
            console.log("Cart Updated: "+cart);
        });
        // User is signed in.
        /*displayName = user.displayName;
		email = user.email;
		emailVerified = user.emailVerified;
		photoURL = user.photoURL;
		isAnonymous = user.isAnonymous;
		uid = user.uid;
		providerData = user.providerData;
		document.getElementById("uid").innerText=email;
		document.getElementById("useronline").style.display="inline";
		document.getElementById("login-btn").style.display="none";
		document.getElementById("logout-btn").style.display="inline";*/
		// ...
	} else {
        $("#login-btn").attr("onclick","window.location.href = './login.html';");
        $("#login-btn").text("Sign In");
        user_data = {'admin':'0'};
        current_user = null;
		try{
            database.ref("users/"+current_user.uid).off();
        }catch{}
        // User is signed out.
		/*document.getElementById("uid").innerText="null";
		document.getElementById("useronline").style.display="none";
		document.getElementById("login-btn").style.display="inline";
		document.getElementById("logout-btn").style.display="none";*/
	}//call: firebase.auth().signOut();
});

function GetFileName(){
    var filename = location.href;
    filename = filename.substr(filename.lastIndexOf('/')+1);
    if(filename == "registerprofile.html") return "no query id";
    filename = filename.substr(0, filename.lastIndexOf('?'));
    return filename;
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function CheckAdmin(myfunction){//waiting for user data loading
	if(user_data != null) { 
        if(user_data['admin'] == '0') {
            alert("This function is for administrators only. Please sign in with an administrator account.");
            window.location.href='./index.php';
        }
        else{
            myfunction();
        }
        return ;
     }
	console.log("Checking admin auth ... ");
	sleep(100).then(() => {
		CheckAdmin(myfunction);
	})
}

//======== general functions ========

function GetQueryString(name)  
{
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null) return unescape(r[2]);
	return null;
}

function readJSON(Snapshot){ //Snapshot to Json
    var tJson = {};
    Snapshot.forEach(function(keyvalues) {
        var childKey = keyvalues.key;
        var childData = keyvalues.val();
        tJson[keyvalues.key] = childData;
    });
    return tJson;
}
