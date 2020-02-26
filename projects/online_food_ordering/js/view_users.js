function ViewUsers(){
	database.ref("users").on("value",function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			var userKey = childSnapshot.key;
			var userName = childSnapshot.val()['name'];
            var newBtn = '<button type="button" class="btn btn-info btn-sm btn-block" onclick="window.open(\'userprofile.html?id='+userKey+'\')">Detail</button>';
            var newLine = $("<tr><td>"+userKey+"</td><td>"+userName+"</td><td>"+newBtn+"</td></tr>");
			$("tbody").append(newLine);
		});
	});
}
