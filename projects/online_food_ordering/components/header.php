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
	<!---->
    <div id="banner">
		<h2>Online Food Ordering</h2>
	</div>
	<div class="container-fluid" style="background: rgb(255,255,255,0.4); text-align: center;">
		<div class="row">
			<div class="col-md-1"></div>
			<div class="col-md-2">
				<button type="button" class="btn 
                <?php 
                if ($filename == 'index.php') echo "btn-info";
                else echo "btn-outline-info";
                ?>
                 btn-sm btn-block">Login / Logout</button>
			</div>
			<div class="col-md-2">
				<button type="button" class="btn 
                <?php 
                if ($filename == 'register.php') echo "btn-info";
                else echo "btn-outline-info";
                ?>
                 btn-sm btn-block">Register</button>
			</div>
			<div class="col-md-2">
				<button type="button" class="btn 
                <?php 
                if ($filename == 'cart.php') echo "btn-info";
                else echo "btn-outline-info";
                ?>
                 btn-sm btn-block">Orders Cart</button>
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
				<button type="button" class="btn 
                <?php 
                if ($filename == 'manager.php') echo "btn-dark";
                else echo "btn-outline-dark";
                ?>
                 btn-sm btn-block">Manager</button>
			</div>
			<div class="col-md-1"></div>
		</div>
	</div>