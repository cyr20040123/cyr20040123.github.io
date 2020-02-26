
// Get a reference to the database service
//var database = firebase.database();

var userJSON;
//var userid = current_user.uid;
var userid = GetQueryString('id');
/*if(current_user==null || userid!=current_user.uid){
	alert("CURRENT USER CHECK ERROR:"+current_user);
	window.location.href='./index.php';
}*/
//alert(userid);
database.ref("users/"+userid).on("value",function(snapshot){
	userJSON = readJSON(snapshot);
	resetContent();
});

function resetContent(){
	document.getElementById('dbid').value = userid;
	document.getElementById('name').value = userJSON['name'];
	document.getElementById('phonenumber').value = userJSON['phonenumber'];
	document.getElementById('address').value = userJSON['address'];
	$("#gender").val(userJSON['gender']);
}

function regSubmit(){
	var userInfo = {};
	var updates = {};
	//userInfo['banquet'] = userJSON['banquet'];
	userInfo['email'] = current_user.email;
	userInfo['admin'] = "0";
	userInfo['name'] = document.getElementById('name').value;
	userInfo['phonenumber'] = document.getElementById('phonenumber').value;
	userInfo['address'] = document.getElementById('address').value;
	userInfo['gender'] = document.getElementById('gender').value;
	if(userInfo['name']=='' || userInfo['phonenumber']=='' || userInfo['address']=='' || userInfo['gender']=='')
	{
		alert("Please fill all the information to continue.");
		return;
	}
	updates['/users/' + userid] = userInfo;
	firebase.database().ref().update(updates);
	alert("Thank you for your registration!");
	window.location.href='./index.php';
}
