/****************************************
**	Project: ModuL3R
**	Author: Kaloyan Iliev
**	Project started: 05/04/2018 - 0:05
**	Project finished: XX/XX/XXXX - XX:XX
****************************************/

$(document).ready(function(){
	
	//Vars needed
	var loaded;
	
	//Moduler init
	function modulerInit(){
		$("div").each(function(i, element){
			var moduler = $(element).attr("moduler");

			if(typeof moduler !== typeof undefined && moduler !== false){
				var modulerURL = "./modules/"+moduler+"/config.json";
				
				//How many modules are loaded and operating
				loaded = i+1;
				
				var modulerContent = $(element).html().replace(/\s/g, "");

				//Ajax request for module config file
				$.ajax({
					url: modulerURL,
					type: 'HEAD',
					error: function(xhr){
						//Message if module is there but empty
						$(element).html("<b>"+moduler+"</b> has been found. Please, add <b>config.json</b> file to complete load the module.");							
					},
					success: function(){
						//Create request for taking data from module - config.json
						var config = $.ajax({
							type: "GET",
							url: modulerURL,
							dataType: "json"
						});
						
						//If request returns without errors
						config.done(function(data){
							modulerBuilder($(element), data.options);
						});
						
						//Show error if request fails
						config.fail(function(jqXHR, textStatus){
							console.log(textStatus);
						});
					}
				});

			}
			else{
				return false;
			}
		});
	
	}
	
	//Moduler Builder
	function modulerBuilder(element, config){
		var applyTo = $(element).attr("moduler");
		
		if(typeof applyTo !== typeof undefined && applyTo !== false){
			//Loop for reading all config options
			$.each(config, function(name, value) {

				//Switch cases for different building element
				switch(name){
					
					//Case id
					case "id":
						$(element).attr(name, value);
					break;
					
					//Case class
					case "class":
						$(element).attr(name, value);
					break;
					
					//Case border
					case "border":
						return $(element).css("border", value+" solid");
					break;
					
					//Case borderColor
					case "borderColor":
						return $(element).css("borderColor", value);
					break;
					
					//Case width
					case "width":
						return $(element).css("width", value);
					break;

					//Case height
					case "height":
						return $(element).css("height", value);
					break;
					
				}

			});
		}
		
	}
	
	modulerInit();
	
});