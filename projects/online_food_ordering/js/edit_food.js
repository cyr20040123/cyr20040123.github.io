
// Get a reference to the database service
//var database = firebase.database();


var foodJSON;
var foodid = GetQueryString('id');
//alert(foodid);
database.ref("foods/"+foodid).on("value",function(snapshot){
	foodJSON = readJSON(snapshot);
	resetContent();
});

function resetContent(){
	document.getElementById('dbid').value = foodid;
	document.getElementById('name').value = foodJSON['name'];
	document.getElementById('description').value = foodJSON['description'];
	$("#category").val(foodJSON['category']);
	$("#enabled").val(foodJSON['enabled']);
	document.getElementById('price').value = foodJSON['price'];
	document.getElementById('imgurl').value = foodJSON['imgurl'];
}

function activeEdit(flag=false){
	$('input').each(function(){
		$(this).attr('disabled',flag);
	});
	$('select').attr('disabled',flag);
	document.getElementById('dbid').setAttribute('disabled',true);
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
	var foodInfo = {};
	var updates = {};
	//foodInfo['banquet'] = foodJSON['banquet'];
	foodInfo['name'] = document.getElementById('name').value;
	foodInfo['category'] = document.getElementById('category').value;
	foodInfo['description'] = document.getElementById('description').value;
	foodInfo['enabled'] = document.getElementById('enabled').value;
	foodInfo['price'] = document.getElementById('price').value;
	foodInfo['imgurl'] = document.getElementById('imgurl').value;
	updates['/foods/' + foodid] = foodInfo;
  	firebase.database().ref().update(updates);
}

function DeleteFood(){
	if(!confirm("Are you sure to delete this food?")) return;
	//firebase.database().ref("").childKey(foodid).remove();
	database.ref("foods/"+foodid).remove();
	alert("This record has been removed.");
}

// ======== General Functions ========

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
