
function mealNumChange(c){
	//alert(c.value);
	var t = "Please input 8-digit meal number.";
	if(c.value.length == 8){
		switch(c.value % 8){
			case 0: t = "Big Big Hamburger"; break;
			case 1: t = "Beef Noodle"; break;
			case 2: t = "Hot Hot Pizza"; break;
			case 3: t = "Vegetable Salad"; break;
			case 4: t = "Fruit Salad"; break;
			case 5: t = "Pork Sauce Spaghetti"; break;
			case 6: t = "Chinese Fried Rice"; break;
			case 7: t = "Pure Pure Congee"; break;
		}
		document.getElementById("submit-btn").disabled=false;
	}
	else{
		document.getElementById("submit-btn").disabled=true;
	}
	$("#"+c.id).next().prop("placeholder",t);
}

$(document).ready(
	function(){
		$(".time-selector").datetimepicker({
			format: 'dd M yyyy hh:ii',
			weekStart: 0,
			startDate: 0,
			todayBtn: 0,
			autoclose: 1,
			todayHighlight: 1,
			startView: 2,
			minView: 0,  //Number, String. 默认值：0, 'hour'，日期时间选择器所能够提供的最精确的时间选择视图。
			minuteStep: 15,
			clearBtn: false,
			forceParse: true
		});
		$('.time-selector').focus(function(){
			$(this).blur();//Disable user input
			$("#end-time").datetimepicker("setStartDate", $("#begin-time").val());
		});
	},
);
