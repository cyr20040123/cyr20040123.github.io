$(document).ready(
	function(){
		$("input[type='checkbox']").on("change",function(){
			var tcount=0;
			$(".custom-checkbox input[type='checkbox']").each(function(){
				if($(this).is(':checked')){
					tcount+=1;
				}
			});
			$("#generate-btn").text("Generate Report for Selected "+tcount+" Banquet(s)");
			if(tcount <= 0) document.getElementById("generate-btn").disabled=true;
			else document.getElementById("generate-btn").disabled=false;
		});
	},
);
