/****************************************
**	Project: ModuL3R
**	Author: Kaloyan Iliev
**	Project started: 05/04/2018 - 0:05
**	Project finished: XX/XX/XXXX - XX:XX
****************************************/

$(document).ready(function(){
	
	//
	function modulerInit(){
		$("div").each(function(i, element){
			var moduler = $(element).attr("moduler");
			
			if(moduler){
				var modulerContent = $(element).html().replace(/\s/g, "");
				
				console.log(modulerContent.length);

				if(typeof(modulerContent) == "undefined" || modulerContent.length == 0){
					$(element).html("Here is your <b>"+moduler+"</b> content");
				}
				else{
				}
			}
			else{}
		});
	}
	
	modulerInit();
	
});