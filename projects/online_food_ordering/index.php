<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
	<title>Food Ordering System</title>

	<link href="css/bootstrap.min.css" rel="stylesheet">
	<link href="css/main_style.css" rel="stylesheet">
	<script src="https://www.gstatic.com/firebasejs/5.5.9/firebase.js"></script>
	<script src="js/fo_firebase.js"></script>

	<script language="JavaScript" src ="js/popper.min.js"></script>
	<script language="JavaScript" src ="js/jquery-3.3.1.min.js"></script>
	<script language="JavaScript" src ="js/bootstrap.min.js"></script>
	<script language="JavaScript" src ="js/duplicate_content.js"></script>
	<script language="JavaScript" src ="js/view_foods.js"></script>
</head>
<body>
	<!--<script language="JavaScript">headBar();</script>-->
	<div id="banner">
		<h2>Online Food Ordering</h2>
	</div>
	<div class="container-fluid" style="text-align: center;">
		<div class="row">
			<div class="col-md-1"></div>
			<div class="col-md-2">
				<button id="login-btn" onclick="window.location.href='./login.html'" type="button" class="btn btn-outline-success btn-sm btn-block">Login / Logout</button>
			</div>
			<div class="col-md-2">
				<button type="button" onclick="window.location.href='./register.html'" class="btn btn-outline-info btn-sm btn-block">Register</button>
			</div>
			<div class="col-md-2">
				<button type="button" onclick="window.location.href='./cart.html';" class="btn btn-outline-info btn-sm btn-block">Orders Cart</button>
			</div>
			<div class="col-md-2">
				<div class="dropdown">
					<button class="btn btn-outline-info btn-sm btn-block dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						Food Menu
					</button>
					<div class="dropdown-menu" aria-labelledby="dropdownMenu2">
						<button class="dropdown-item" type="button" onclick="window.location.href='index.php';">All</button>
						<button class="dropdown-item" type="button" onclick="window.location.href='index.php?category=chinese';">Chinese Food</button>
						<button class="dropdown-item" type="button" onclick="window.location.href='index.php?category=western';">Western Food</button>
						<button class="dropdown-item" type="button" onclick="window.location.href='index.php?category=japanese';">Japanese Food</button>
						<button class="dropdown-item" type="button" onclick="window.location.href='index.php?category=drink';">Drinks</button>
					</div>
				</div>
			</div>
			<div class="col-md-2">
				<div class="dropdown">
					<button class="btn btn-outline-dark btn-sm btn-block dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						Manager
					</button>
					<div class="dropdown-menu" aria-labelledby="dropdownMenu2">
						<button id="edit-btn" class="dropdown-item" type="button" onclick="EditFood(true);">Edit Foods</button>
						<button class="dropdown-item" type="button" onclick="CheckAdmin(AddFood);">Add Food</button>
						<button class="dropdown-item" type="button" onclick="window.open('./vieworders.html');">View Orders</button>
						<button class="dropdown-item" type="button" onclick="window.open('./viewusers.html');">View Users</button>
					</div>
				</div>
			</div>
			<div class="col-md-1"></div>
		</div>
	</div>
	<br/>
	<div id="food-card-container" class="container-fluid">
		<div class="row food-card align-items-center">
			<div class="col-lg-1"></div>
			<div class="col-lg-3 col-md-4 col-sm-4">
				<img class="img-thumbnail rounded mx-auto d-block" src="img/food.jpg" alt="food" style="margin: 0px auto;"/>
			</div>
			<div class="col-lg-5 col-md-6 col-sm-6">
				<table class="table table-hover table-sm">
					<thead>
						<tr>
							<th>Loading ...</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Please wait for the data from the database.</td>
						</tr>
						<tr>
							<td>Category</td>
						</tr>
						<tr>
							<th>Price: $0 / each</th>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="col-lg-2 col-md-2 col-sm-2">
				<form>
					<div class="form-group">
						<input class="form-control form-control-sm" type="number" min="1" max="99" value="1" placeholder="Number"/>
						<input class="form-control form-control-sm" type="text" placeholder="Total: $0" readonly>
						<button type="submit" class="form-control btn btn-primary btn-sm form-control-sm">Add to Cart</button>
					</div>
					
				</form>
			</div>
			<div class="col-lg-1"></div>
		</div>
		<div id="end-tag" style="display:none"></div>
	</div>
	<script language="JavaScript">ViewFoods();</script>
    <div class="container-fluid" style="text-align: center;">
        <p>
        <?php
        date_default_timezone_set("PRC");
        echo "Thank you for visiting the food ordering system. @ ".date("Y-m-d l H:i:s A");
        ?>
        </p>
    </div>
</body>
</html>
