// Get a reference to the database service
var category = GetQueryString('category');
var foods = {};

function ViewCart(){
	database.ref("foods").on("value",function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			var foodKey = childSnapshot.key;
			var foodData = childSnapshot.val();
			if(category!=null && foodData.category!=category) return;
			console.log(foodData);
			foods[foodKey] = foodData;
			foods[foodKey]['id'] = foodKey;
			foodData['id'] = foodKey;
		});
        database.ref("carts/"+current_user.uid).on("value",function(snapshot){
            $("#food-card-container").html("");
            snapshot.forEach(function(foodSnapshot){
                var foodkey = foodSnapshot.key;
                var amount = foodSnapshot.val();
                console.log("Cart Item: "+foodkey+" * "+amount);
                BuildFoodCard_Cart(foods[foodkey], amount);
            });
        });
	});
}

function SetToCart(id,amount){
    amount = parseInt(amount);
    if(amount == 0){
        RemoveFromCart(id);
        return;
    }
	if(cart == null) cart = {};
	cart[id]=amount;
	var updates={};
	updates['/carts/'+current_user.uid] = cart;
	firebase.database().ref().update(updates);
    console.log("Set "+amount+" * "+id+" to cart.");
}
function RemoveFromCart(id){
    if(cart == null) return;
    delete cart[id];
    var updates={};
	updates['/carts/'+current_user.uid] = cart;
	firebase.database().ref().update(updates);
    console.log("Removed "+id+" from cart.");
}

function Checkout(){
    var info = "";
    info += "[User] "+user_data['name']+"\n";
    info += "[User ID] "+current_user.uid+"\n";
    info += "[Address] "+user_data['address']+"\n";
    info += "[Orders]\n";
    var tmoney, totmoney=0.0;
    for (ikey in cart){
        console.log(ikey);
        tmoney = parseFloat(foods[ikey]['price']) * 0.9 * parseInt(cart[ikey]);
        info += "- - "+foods[ikey]['name']+"  (#"+ikey+")\n";
        info += "- - "+"$"+parseFloat(foods[ikey]['price']) * 0.9 + "*" + cart[ikey] + "= $" + tmoney + "\n";
        totmoney += tmoney;
    }
    if(totmoney == 0) {
        alert("Your cart is empty.");
        window.location.href="./index.php";
        return;
    }
    info += "[Total] $" + totmoney + "\n";
    if(confirm("Please check your order:\n\n"+info+"\nAre you sure to pay [$"+totmoney+"] and confirm your order?")){
        var updates={};
        updates['/carts/'+current_user.uid] = {};
        firebase.database().ref().update(updates);
        console.log("Checked out "+current_user.id+" cart.");
        var newOrderKey = firebase.database().ref().child('orders').push().key;
        var order_data = {
            "info":info.replace(/\n/g,"<br/>"),
            "user":current_user.uid,
            "money":totmoney,
            "timestamp":(new Date()).valueOf()
        };
        updates = {};
        updates['/orders/' + newOrderKey] = order_data;
        firebase.database().ref().update(updates)
        alert("Your order has been accepted.\n\nPlease wait for the delivery.");
        window.location.href="./index.php";
        /*opener=null;
        window.open('','_self');
        window.close();*/
    }
}

function BuildFoodCard_Cart(food, amount)
{
    var price = food.price;
    if(current_user!=null) price *= 0.9;
	var card_ele = $("<div class='row food-card align-items-center' style='background:#E0E8E8;'></div>");
	var space_ele = $("<div class='col-lg-1'></div>");
	var img_div_ele = $("<div class='col-lg-3 col-md-4 col-sm-4'></div>");
	var img_ele = $("<img class='img-thumbnail rounded mx-auto d-block' src='"+ food.imgurl +"' alt='"+ food.name +"'/>");
	var info_div_ele = $("<div class='col-lg-5 col-md-6 col-sm-6'><table class='table table-hover table-sm'><thead><tr><th>" + food.name 
	+ "</th></tr></thead><tbody><tr><td>" + food.description 
	+ "</td></tr><tr><td>" + food.category 
	+ "</td></tr><tr><th>Price: $" + price 
	+ " / each</th></tr></tbody></table></div>");
	var form_div_ele = $("<div class='col-lg-2 col-md-2 col-sm-2'><div class='form-group' id='"+food.id+"'><input class='amount form-control form-control-sm number-input' type='number' min='1' max='99' value='' placeholder='Number'/>"
	+ "<input class='money form-control form-control-sm' type='text' placeholder='Total: $' readonly/>" 
    + "<button class='form-control btn btn-info btn-sm form-control-sm' onclick='"+"SetToCart(\""+food.id+"\", $(\"#"+food.id+"\").find(\"input.number-input\").val());'>Update Quantity</button>"
	+ "<button class='form-control btn btn-danger btn-sm form-control-sm' onclick='"+"RemoveFromCart(\""+food.id+"\");'>Remove</button></div></div>");
	var space_ele2 = $("<div class='col-lg-1'></div>");
	$("#food-card-container").append(
		card_ele.append(
			space_ele,
			img_div_ele.append(img_ele),
			info_div_ele,
			form_div_ele,
			space_ele2
		)
	);
    $("#"+food.id).find("input.amount").val(amount);
    $("#"+food.id).find("input.money").val('Total: $'+price*amount);
}
/*
    <div class="row food-card align-items-center">
			<div class="col-lg-1"></div>
			<div class="col-lg-3 col-md-4 col-sm-4">
				<img class="img-thumbnail rounded mx-auto d-block" src="img/food.jpg" alt="food" style="margin: 0px auto;"/>
			</div>
			<div class="col-lg-5 col-md-6 col-sm-6">
				<table class="table table-hover table-sm">
					<thead>
						<tr>
							<th class="tb-food-name">Food Name</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td class="tb-food-description">Descriptions ...Descriptions ...Descriptions ...</td>
						</tr>
						<tr>
							<td class="tb-food-category">Category</td>
						</tr>
						<tr>
							<th class="tb-food-price>Price: $5 / each</th>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="col-lg-2 col-md-2 col-sm-2">
				<form id='id'>
					<div class="form-group">
						<input class="form-control form-control-sm" type="number" min="1" max="99" value="1" placeholder="Number"/>
						<input class="form-control form-control-sm" type="text" placeholder="Total: $0" readonly>
						<button type="submit" class="form-control btn btn-primary btn-sm form-control-sm">Add to Cart</button>
					</div>
					
				</form>
			</div>
			<div class="col-lg-1"></div>
		</div>
*/
