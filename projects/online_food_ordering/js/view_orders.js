function ViewOrders(){
	database.ref("orders").on("value",function(snapshot) {
		$("#orders-container").html("");
		snapshot.forEach(function(childSnapshot) {
			var orderdetail = childSnapshot.val()['info'];
			console.log(orderdetail);
			var timestr = new Date(childSnapshot.val()['timestamp']).toUTCString();
            var newLine = $("<div><h6>"+timestr+"</h6><p>"+orderdetail+"</p></div>");
			$("#orders-container").append(newLine);
		});
	});
}
