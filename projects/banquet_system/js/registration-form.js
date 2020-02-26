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
var banquets = new Array();

function readJSON(Snapshot){
    var tJson = {};
    Snapshot.forEach(function(keyvalues) {
        var childKey = keyvalues.key;
        var childData = keyvalues.val();
        tJson[keyvalues.key] = childData;
    });
    return tJson;
}

function readBanquets(){
	var banquetJSON, banquetKey;
	var newChild, tnode;
    console.log("Banquet database on tracking.");
    database.ref("banquet").orderByKey().once("value").then(function(snapshot){
		snapshot.forEach(function(banquetSnapshot) {
            banquetJSON = readJSON(banquetSnapshot);
			banquetKey = banquetSnapshot.key;
			banquets[banquetKey] = banquetJSON;
			newChild = '<tr><td><div class="custom-control custom-radio">';
			newChild = newChild + '<input type="radio" name="banquetRadio" class="custom-control-input" ';
			newChild = newChild + 'id="' + banquetKey +'" value="'+ banquetKey+'"/><label class="custom-control-label" for="'+ banquetKey +'"></label></div></td>';
			newChild = newChild + '<td>' + '...'+banquetKey.substring(banquetKey.length-6) + '</td>';
			newChild = newChild + '<td>' + banquetJSON["name"] + '</td>';
			newChild = newChild + '<td>' + banquetJSON["beginTime"] +'</td>';
			newChild = newChild + '<td>' + banquetJSON["location"] +'</td>';
			newChild = newChild + '<td>' + banquetJSON["remark"] + '</td>';
			tnode = document.createElement('tr');
			tnode.innerHTML = newChild;
			document.getElementById("banquet-table").appendChild(tnode);
		});
		document.getElementById("next-btn-1").innerText = 'Next';
		document.getElementById("next-btn-1").disabled = false;
		$("#table-selector td").click(
			function(){
				$(this).parent().find("input:radio").prop("checked",true);
			}
		);
	});
	database.ref("meal").on("value",function(snapshot){
		mealsSnapshot = snapshot;
	});
}

var mealsSnapshot;
function loadMeals(){
	var meal1 = banquets[getRadioBoxValue('banquetRadio')]['meal1'];
	var meal2 = banquets[getRadioBoxValue('banquetRadio')]['meal2'];
	var meal3 = banquets[getRadioBoxValue('banquetRadio')]['meal3'];
	var meal4 = banquets[getRadioBoxValue('banquetRadio')]['meal4'];
	var mealJSON, mealKey, newChild;
	mealsSnapshot.forEach(function(mealSnapshot) {
		mealJSON = readJSON(mealSnapshot);
		mealKey = mealSnapshot.key;
		if(mealKey == meal1){
			newChild = '<div class="meal-info"><h5>'+mealJSON['name']+'</h5>';
			newChild += '<h6>'+mealJSON['category']+'</h6></div>';
			document.getElementById("meal1-content").innerHTML = newChild;
		}
		if(mealKey == meal2){
			newChild = '<div class="meal-info"><h5>'+mealJSON['name']+'</h5>';
			newChild += '<h6>'+mealJSON['category']+'</h6></div>';
			document.getElementById("meal2-content").innerHTML = newChild;
		}
		if(mealKey == meal3){
			newChild = '<div class="meal-info"><h5>'+mealJSON['name']+'</h5>';
			newChild += '<h6>'+mealJSON['category']+'</h6></div>';
			document.getElementById("meal3-content").innerHTML = newChild;
		}
		if(mealKey == meal4){
			newChild = '<div class="meal-info"><h5>'+mealJSON['name']+'</h5>';
			newChild += '<h6>'+mealJSON['category']+'</h6></div>';
			document.getElementById("meal4-content").innerHTML = newChild;
		}
	});
}

function getRadioBoxValue(radioName){
	var obj = document.getElementsByName(radioName);
	for(i=0; i<obj.length;i++) {
		if(obj[i].checked) {
			return obj[i].value;
		}
	}
	return null;
}

function regSubmit(){
	var attendeeRefKey = database.ref('users').push().key;
	var userInfo = {};
	var updates = {};
	userInfo['banquet'] = getRadioBoxValue('banquetRadio');
	userInfo['first_name'] = document.getElementById('first-name').value;
	userInfo['last_name'] = document.getElementById('last-name').value;
	userInfo['type'] = document.getElementById('guest-type').value;
	userInfo['company'] = document.getElementById('ao').value;
	userInfo['phone'] = document.getElementById('phone').value;
	userInfo['email'] = document.getElementById('email').value;
	userInfo['meal'] = getRadioBoxValue('meal');
	userInfo['drink'] = getRadioBoxValue('drink');
	userInfo['remark'] = document.getElementById('remark').value;
	updates['/users/' + attendeeRefKey] = userInfo;
  	firebase.database().ref().update(updates);
	//////////shang ci dao zhe li
}


function guestTypeChange(){
	if(document.getElementById("guest-type").value=='delegate') {
		document.getElementById("remark-label").innerText = "Remark";
		document.getElementById("remark").setAttribute("placeholder","Please comment if you need special care (e.g. allergy, physical disability).");
	}
	else{
		document.getElementById("remark-label").innerText = "Special Request";
		document.getElementById("remark").setAttribute("placeholder","Please input if you have special meal or drink request and remarks.");
	}
}

function checkP1(){
	var selectedIndex = -1;
	var radios = document.getElementsByName("banquetRadio");
	var i = 0;
	for (i=0; i < radios.length; i++) {
        if (radios[i].checked) {
			$('.row1').hide(); $('.row2').show();
			selectedIndex = i;
			break;
        }
    }
	if (selectedIndex < 0){
		alert("Please choose the banquet to move on.");
	}
	loadMeals();
}

function checkP2(){
	var idlist = ["first-name","first-name","guest-type","ao","phone","email"];
	var i;
	var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
	var tel = /^\d{8}$/;
	for(i=0;i<idlist.length;i++){
		if (document.getElementById(idlist[i]).value == null || document.getElementById(idlist[i]).value == "") {
			alert("Please fill all the fields to continue.");
			return;
		}
	}
	/*
	if (getElementById("phone").value.length != 8) {
		alert("Please input a 8-digit Hong Kong phone number.");
		return;
	}*/
	if (!tel.test(document.getElementById("phone").value)) {
		alert("Please input a 8-digit Hong Kong phone number.");
		return ;
	}
	if (!reg.test(document.getElementById("email").value)) {
		alert("Please input a legal email address.");
		return ;
	}
	$('.row2').hide(); $('.row3').show();
}


function checkP3(){
	var mealflag = -1, drinkflag = -1;
	var radios = document.getElementsByName("meal");
	var i = 0;
	for (i=0; i < radios.length; i++) {
        if (radios[i].checked) {
			mealflag = i;
			break;
        }
	}
	radios = document.getElementsByName("drink");
	for (i=0; i < radios.length; i++) {
        if (radios[i].checked) {
			drinkflag = i;
			break;
        }
	}
	if (mealflag < 0){
		alert("Please select one meal.");
		return;
	}
	if (drinkflag < 0){
		alert("Please select one drink.");
		return;
	}
	var remarkcontent = document.getElementById("remark");
	if (remark.value == null || remark.value == ""){
		if(!confirm("Are you sure to submit without remark?")) return ;
	}
	
	if(!confirm("Are you sure to submit your registration?")) return ;
	//$('.row3').hide(); $('.row4').show();
	window.onbeforeunload = null;
	//document.getElementById("attendee-reg").submit();
	regSubmit();
	alert("Your registration has been successfully submitted!\n\nPlease remember your email [ " + document.getElementById("email").value + " ] which will be your identification for further needs.");
	self.location='index.html';
}

$(document).ready(
	function(){
		$(".meal-choice-div").click(
			function(){
				$(this).find("input:radio").prop("checked",true);
				//alert($(this).parent().find("input:radio").attr("checked"));
			}
		)
	}
);


