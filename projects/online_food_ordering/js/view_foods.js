// Get a reference to the database service
var category = GetQueryString('category');
var foods = {};

function EditFood(turnto=false){
	if(user_data["admin"] == "0"){
		alert("Please sign in with an administrator account!");
		return;
	}
	if(turnto){
		$("button.edit-food-btn").css("display","inline");
		$("#edit-btn").text("Exit Edit");
		$("#edit-btn").attr("onclick","EditFood(false);");
	}
	else{
		$("button.edit-food-btn").css("display","none");
		$("#edit-btn").text("Edit Foods");
		$("#edit-btn").attr("onclick","EditFood(true);");
	}
}

function AddFood(){
	var newFoodKey = firebase.database().ref().child('posts').push().key;
	var foodData = {
		category: "chinese",
		description: "please add description ...",
		enabled: "false",
		imgurl: "http://www2.comp.polyu.edu.hk/~16098521d/treasure-box/no_image.jpg",
		name: "Food Name",
		price: "0"
	}
	var updates={};
	updates['/foods/' + newFoodKey] = foodData;
	alert("New food item created, please finish the information." + firebase.database().ref().update(updates));
	window.open("./editfood.html?id="+newFoodKey);
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function ViewFoods(){//waiting for user data loading
	if(user_data != null) { ReadFoods(); return; }
	console.log("Waiting for user loading ... ");
	sleep(300).then(() => {
		ViewFoods();
	})
}

function ReadFoods(){
	database.ref("foods").on("value",function(snapshot) {
		$("#food-card-container").html("");
		snapshot.forEach(function(childSnapshot) {
			var foodKey = childSnapshot.key;
			var foodData = childSnapshot.val();
			if(category!=null && foodData.category!=category) return;
			console.log(foodData);
			foods[foodKey] = foodData;
			foods[foodKey]['id'] = foodKey;
			foodData['id'] = foodKey;
			if(user_data["admin"] == "1" || foodData['enabled'] == "true") {
				BuildFoodCard(foodData);
			}
		});
		//foodJSON = readJSON(snapshot);
		//resetContent();
	});
}

function AddToCart(id,number){
	number = parseInt(number);
	if(cart == null) cart = {};
	if(cart[id] == null) cart[id]=number;
	else cart[id]=parseInt(cart[id])+number;
	var updates={};
	updates['/carts/'+current_user.uid] = cart;
	firebase.database().ref().update(updates);
	alert(number+" items have been added to your cart.");
	/*database.ref("carts/"+current_user.uid).once("value",function(snapshot){
		cart = snapshot.val();
	});*/
}

function BuildFoodCard(food)
{
	var price = food.price;
    if(current_user!=null) price *= 0.9;
	var card_ele = $("<div class='row food-card align-items-center'></div>");
	var space_ele = $("<div class='col-lg-1'></div>");
	var img_div_ele = $("<div class='col-lg-3 col-md-4 col-sm-4'></div>");
	var img_ele = $("<img class='img-thumbnail rounded mx-auto d-block' src='"+ food.imgurl +"' alt='"+ food.name +"'/>");
	var info_div_ele = $("<div class='col-lg-5 col-md-6 col-sm-6'><table class='table table-hover table-sm'><thead><tr><th>" + food.name 
	+ "</th></tr></thead><tbody><tr><td>" + food.description 
	+ "</td></tr><tr><td>" + food.category 
	+ "</td></tr><tr><th>Price: $" + price 
	+ " / each</th></tr></tbody></table></div>");
	var form_div_ele = $("<div class='col-lg-2 col-md-2 col-sm-2'><div class='form-group' id='"+food.id+"'><input class='form-control form-control-sm number-input' type='number' min='1' max='99' value='1' placeholder='Number'/>"
	//+ "<input class='form-control form-control-sm' type='text' placeholder='Total: $0' readonly/>" 
	+ "<button class='form-control btn btn-primary btn-sm form-control-sm' onclick='"+"AddToCart(\""+food.id+"\", $(\"#"+food.id+"\").find(\"input.number-input\").val());'>Add to Cart</button>" 
	+ "<button style='display:none;' class='edit-food-btn form-control btn btn-info btn-sm form-control-sm' onclick='window.open(\"editfood.html?id=" +food.id+ "\");'>Edit</button>" 
	+ "</div></div>");
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
}
