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
// Get a reference to the database service
var database = firebase.database();


function GetQueryString(name)  
{
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null) return unescape(r[2]);
	return null;
}

function readJSON(Snapshot){
    var tJson = {};
    Snapshot.forEach(function(keyvalues) {
        var childKey = keyvalues.key;
        var childData = keyvalues.val();
        tJson[keyvalues.key] = childData;
    });
    return tJson;
}

var userJSON;
var uid = GetQueryString('id');
database.ref("users/"+uid).on("value",function(snapshot){
	userJSON = readJSON(snapshot);
	resetContent();
});

function resetContent(){
	document.getElementById('dbid').value = uid;
	document.getElementById('first-name').value = userJSON['first_name'];
	document.getElementById('last-name').value = userJSON['last_name'];
	$("#guest-type").val(userJSON['type']);
	document.getElementById('ao').value = userJSON['company'];
	document.getElementById('phone').value = userJSON['phone'];
	document.getElementById('email').value = userJSON['email'];
	document.getElementById('meal').value = userJSON['meal'];
	document.getElementById('drink').value = userJSON['drink'];
	document.getElementById('remark').value = userJSON['remark'];
}

function activeEdit(flag=false){
	$('input').each(function(){
		$(this).attr('disabled',flag);
	});
	document.getElementById('dbid').setAttribute('disabled',true);
	$('select#guest-type').attr('disabled',flag);
	if(flag==false) {
		document.getElementById("edit-btn").innerText="Save Submit";
		document.getElementById("edit-btn").setAttribute('onclick','javascript: regSubmit(); activeEdit(true);');
	}
	else {
		document.getElementById("edit-btn").innerText="Edit";
		document.getElementById("edit-btn").setAttribute('onclick',"javascript: activeEdit();");
	}
}


function regSubmit(){
	var userInfo = {};
	var updates = {};
	userInfo['banquet'] = userJSON['banquet'];
	userInfo['first_name'] = document.getElementById('first-name').value;
	userInfo['last_name'] = document.getElementById('last-name').value;
	userInfo['type'] = document.getElementById('guest-type').value;
	userInfo['company'] = document.getElementById('ao').value;
	userInfo['phone'] = document.getElementById('phone').value;
	userInfo['email'] = document.getElementById('email').value;
	userInfo['meal'] = document.getElementById('meal').value;
	userInfo['drink'] = document.getElementById('drink').value;
	userInfo['remark'] = document.getElementById('remark').value;
	updates['/users/' + uid] = userInfo;
  	firebase.database().ref().update(updates);
}