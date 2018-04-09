$("document").ready(function(){
	//Check for Library
	/*
	if(jQuery().L.Map) {
		console.log("TWDA");
	}
	*/
	//Helper init elements
	var helperExists = false;							//helperExists - if does do not init()
	var refreshRate = $(".helper").attr("refreshRate"); //Refresh rate for the helper
	var status = $(".helper").attr("status");
	var helper = null, helper_class = "bot-helper";		//Element where helper will be included
	var numQuotes = 5;									//Number of quotes
	var quotesArray = [];								//Array for the quotes
	var dragStatus = false;								//Drag status of helper
	var quoteTimer;										//Quotes timer
	var helperLoader;									//Helper loaded
	var tictactoe;										//Small game of tic-tac-toe
	var gameRunning = false;							//If games are already executed
	
	/*Helper loader*/
	helperLoader = 	'<div class="sk-cube-grid center-block">';
	helperLoader += '<div class="sk-cube sk-cube1"></div>';
	helperLoader += '<div class="sk-cube sk-cube2"></div>';
	helperLoader += '<div class="sk-cube sk-cube3"></div>';
	helperLoader += '<div class="sk-cube sk-cube4"></div>';
	helperLoader += '<div class="sk-cube sk-cube5"></div>';
	helperLoader += '<div class="sk-cube sk-cube6"></div>';
	helperLoader += '<div class="sk-cube sk-cube7"></div>';
	helperLoader += '<div class="sk-cube sk-cube8"></div>';
	helperLoader += '<div class="sk-cube sk-cube9"></div>';
	helperLoader += '</div>';
	
	$(".helper").append(helperLoader);
	
	/* TIC TAC TOE */
	tictactoe = '<div class="tic-tac-toe">';
	tictactoe += '<div id="square1" class="tile free"></div>';
	tictactoe += '<div id="square2" class="tile free"></div>';
	tictactoe += '<div id="square3" class="tile free"></div>';
	tictactoe += '<div id="square4" class="tile free"></div>';
	tictactoe += '<div id="square5" class="tile free"></div>';
	tictactoe += '<div id="square6" class="tile free"></div>';
	tictactoe += '<div id="square7" class="tile free"></div>';
	tictactoe += '<div id="square8" class="tile free"></div>';
	tictactoe += '<div id="square9" class="tile free"></div>';
	tictactoe += '</div>';	
	
	function helperInit(){
		helperExists = true;
		
		//Get current status and reverse to opposite
		if($(".helper").attr("status") == "active"){
			var statusChange = "Deactive";
		}
		else{
			var statusChange = "Active";
		}

		
		var helperMenu = "<ul class='helper-menu'>";
		helperMenu += "<li data-action='helperStatus'>"+statusChange+"</li>";
		helperMenu += "<li data-action='search'>Ask a question</li>";
		helperMenu += "<li data-action='playMusic'>Play radio</li>";
		helperMenu += "<li data-action='swear'>Say bullshits</li>";
		helperMenu += "<li class='divider'>-- GAMES --</li>";
		helperMenu += "<li data-action='tictactoe'>Tic-Tac-Toe</li>";
		helperMenu += "</ul>";
		
		if(status == "active"){
			//Create the bot-helper
			$(".helper").append("<div class='"+helper_class+"'></div>");
			$(".helper").append("<div class='helper-quote'></div>");
			$(".helper").append(helperMenu);
			
			//Hide loader
			$(".sk-cube-grid").hide();
			
			//Assign the helper
			helper = $(".bot-helper");
			
			//Check if bot-helper is created and add draggable
			if(helper.length > 0){
				helper.draggable({
					containment: "document",
					drag: function(){
						dragStatus = true;
						//Hide helper menu
						$(".helper-menu").hide(100);					
					},
					stop: function(){
						dragStatus = false;
					}
				});			

				//Add left click on bot-helper
				helper.on("mousedown", function(event){
					//Set drag status
					dragStatus = false;
					
					//Hide helper menu
					$(".helper-menu").hide(100);
					
				}).on("mousemove", function(event){
					
					//Find position of helper and set quotes position based on that
					var helperPosition = $(".bot-helper");
					var windowEdge = $(window).width();
					
					if(helperPosition.offset().left + helperPosition.outerWidth() >= windowEdge){
						var currectLeft = helperPosition.position().left - 90;
					}
					else{
						var currectLeft = helperPosition.position().left + 100;
					}
					
					$(".helper-quote").css({
						"top": helperPosition.position().top,
						"left": currectLeft
					});				
					
				}).on("mouseup", function(event){

					var wasDragged = dragStatus;
					
					dragStatus = false;
					
					if(!wasDragged) {
						//Switch between both mouse buttons
						switch(event.which){
							//Left button
							case 1:
								helperQuotes();
							break;
							
							//Middle button
							case 2:
								console.log("Add something");
							break;
							
							//Right button
							case 3:
								helper.bind("contextmenu", function (event) {
									// Avoid the real one
									event.preventDefault();
									
									//Find position of helper and set helper menu position
									var helperPosition = $(".bot-helper");
									var windowEdge = $(window).width();
									
									if(helperPosition.offset().left + helperPosition.outerWidth() >= windowEdge){
										var currectLeft = helperPosition.position().left - 40;
									}
									else{
										var currectLeft = helperPosition.position().left + 80;
									}	
									
									$(".helper-menu").show(100).css({
										top: event.pageY + "px",
										left: currectLeft
									});
								});							
							break;
							
							//Default
							default:
								alert('You have a strange Mouse!');
							break;
						}
					}	
					
				});
				
				//On helper-menu click
				$(".helper-menu").on("click", "li", function(event){
					var option = $(this).data("action");
					
					//Switch options
					switch(option){
						//Case status
						case "helperStatus":
							var takeStatus = $(this).text().toLowerCase();
							
							$(".helper").attr("status", takeStatus);
							
							$(".helper").fadeOut('slow');
						break;
						
						//Case search
						case "search":
							helperQuotes("search");
						break;
						
						//Case playMusic
						case "playMusic":
							helperQuotes("playMusic");
						break;
						
						//Case games
						case "tictactoe":
							if($(".tic-tac-toe").length < 1){
								$("body").append(tictactoe);
								TicTacToe();
								
								helperQuotes("tictac");
							}
							else{
								helperQuotes("gamingThanks");
							}
							
							$(".tic-tac-toe").fadeToggle();	
						break;
						
						//Swears
						case "swear":
							helperQuotes("swear1");
						break;
						
						default:
							helperQuotes("not exists");
						break;
					}
					
					//Hide menu after click
					$(".helper-menu").hide(100);
					
				});	
				
			}
			else{}
		}
		else{
			$(".helper").remove();
		}
	
	}
	
	
	//Helper Quotes
	function helperQuotes(custom){
		clearTimeout(quoteTimer);
		
		//Case random numbers
		var cases = randomNumber();
		
		if(typeof(custom) == "undefined"){}
		else{
			cases = custom;
		}
		
		//Find position of helper and set quotes position based on that
		var helperPosition = $(".bot-helper");
		var windowEdge = $(window).width();
		
		if(helperPosition.offset().left + helperPosition.outerWidth() >= windowEdge){
			var currectLeft = helperPosition.position().left - 90;
		}
		else{
			var currectLeft = helperPosition.position().left + 100;
		}
		
		$(".helper-quote").css({
			"top": helperPosition.position().top,
			"left": currectLeft
		});
		
		$(".helper-quote").attr('class', 'helper-quote');
		
		//Fade-in the quote
		$(".music").remove();
		$(".helper-quote").fadeIn();
		
		//Clear all
		quoteTimer = setTimeout(function(){
			$(".helper-quote").hide('slow');
			$(".helper-quote").attr('class', 'helper-quote');
			$(".helper-quote").html("");
			gameRunning = false;
		}, 2500);		
		
		//Switcher for quotes
		switch(cases){
			
			//Case joke
			case 1:
				$(".helper-quote").addClass("alert alert-primary");
				$(".helper-quote").html("The other day, my wife asked me to pass her lipstick but I accidentally passed her a glue stick. She still isn't talking to me");
				helperSay($(".helper-quote").text());
			break;
			
			//Case Einstein
			case 2:
				$(".helper-quote").addClass("alert alert-info");
				$(".helper-quote").html("Imagination is more important than knowledge.");
				helperSay($(".helper-quote").text());
			break;
			
			//Case search
			case "search":
				$(".helper-quote").addClass("alert alert-danger");
				$(".helper-quote").html("Searching...");
				clearTimeout(quoteTimer);
				
				//Speak it
				helperSay($(".helper-quote").text());
			break;
			
			//Case playMusic
			case "playMusic":
				$(".helper-quote").addClass("alert alert-primary");
				$(".helper-quote").html("<b class='radio-title'>Revolution radio<br/></b><img src='./modules/helper/animations/music_bars.gif' width='68px' height='68px'/>");
				//BG - RADIO http://stream.radioreklama.bg:80/radio1.ogg"
				$(".helper").append('<audio class="music" autoplay><source src="http://revolutionradio.ru/live.ogg" type="audio/ogg; codecs=&quot;opus&quot;"></audio>');
				
				setTimeout(function(){
					$(".radio-title").fadeOut();
				}, 1500);
				
				clearTimeout(quoteTimer);
			break;
			
			//Case GAMES
			case "tictac":
				$(".helper-quote").addClass("alert alert-dark");
				$(".helper-quote").html("Let's test your skills in a game of Tic-Tac-Toe!");
				helperSay($(".helper-quote").text());
			break;
			
			//Case thanks
			case "gamingThanks":
				$(".helper-quote").addClass("alert alert-success");
				$(".helper-quote").html("Thank you for the game!");

				//Speak it
				helperSay($(".helper-quote").text());					
			break;
			
			//Case swears
			case "swear1":
				$(".helper-quote").addClass("alert alert-danger");
				$(".helper-quote").html("Теперь все идет к черту ...");

				//Speak it
				helperSay($(".helper-quote").text(), "ru");				
			break;
			
			//Case not exists
			case "not exists":
				$(".helper-quote").addClass("alert alert-danger");
				$(".helper-quote").html("That action do not exists... O.o");	
				helperSay($(".helper-quote").text());				
			break;
			
			//Nothing to say
			default:
				$(".helper-quote").addClass("alert alert-warning");
				$(".helper-quote").html("Nothing to say...");
				helperSay($(".helper-quote").text());
			break;
		}
		
	}
	
	//Helper speak
	function helperSay(message, lang){
		
		//Cancel all others
		speechSynthesis.cancel();
		
		if(typeof(lang) == "undefined"){
			var i = 1;
			var p = 1.5;
			var r = 0.6;
			var v = 1;
		}
		else{
			if(lang == "ru"){
				var i = 17;
				var p = 1.5;
				var r = 1;
				var v = 1;
			}
		}
		
		//Speak the new one
		var timer = setInterval(function() {
			var msg = new SpeechSynthesisUtterance(message);
			var voices = speechSynthesis.getVoices();
			
			//console.log(voices);
			if (voices.length !== 0) {
				msg.voice = voices[i];	//17 - Russian, 15 - Poland
				msg.pitch = p;
				msg.rate = r;
				msg.volume = v;
				
				speechSynthesis.speak(msg);
				clearInterval(timer);
			}
		}, 50);
		
	}
	
	//Random number
	function randomNumber() {
		// refill the array if needed
		if (!quotesArray.length) {
			for (var i = 0; i < numQuotes; i++) {
				quotesArray.push(i);
			}
		}
		var index = Math.floor(Math.random() * quotesArray.length);
		var val = quotesArray[index];

		// now remove that value from the array
		quotesArray.splice(index, 1);

		return val;

	}

	//Check and load helper based on refresh rate
	if(!refreshRate){
		setInterval(function(){
			var status = $(".helper").attr("status");
			
			console.log(status);
			
			if(helperExists == false){
				helperInit();
			}
		}, 500);
	}
	else{
		setInterval(function(){
			var status = $(".helper").attr("status");
			
			console.log(status);
			
			if(helperExists == false){
				helperInit();
			}
		}, refreshRate);		
	}
	
	/************* GAMES **************/
	
	//Tic-Tac-Toe GAME
	function TicTacToe(){
		var sq1 = $('#square1');
		var sq2 = $('#square2');
		var sq3 = $('#square3');
		var sq4 = $('#square4');
		var sq5 = $('#square5');
		var sq6 = $('#square6');
		var sq7 = $('#square7');
		var sq8 = $('#square8');
		var sq9 = $('#square9');

		var playValid = false;
		var win = false;



		function validatePlay(squareplayed) {
			if ( $(squareplayed).hasClass('free') ) {
				playValid = true;
			} else {
				playValid = false;
				return false;
			}
		}

		function clearBoard() {
			$('.tile').removeClass('played');
			$('.tile').removeClass('O-play');
			$('.tile').removeClass('X-play');
			$('.tile').html('');
			$('.tile').addClass('free');
		}

		function winAlert(player) {
			win = true;

			if (player == "X") {
				alert("Congratulations, you beat the computer!")
			} else {
				alert("You lost!")
			}
			clearBoard();
		}

		function checkWin() {

			if ( sq1.hasClass('X-play') && sq2.hasClass('X-play') && sq3.hasClass('X-play') ) {
				winAlert("X");
			} else if ( sq1.hasClass('O-play') && sq2.hasClass('O-play') && sq3.hasClass('O-play') ) {
				winAlert("O");
			}

			else if ( sq4.hasClass('X-play') && sq5.hasClass('X-play') && sq6.hasClass('X-play') ) {
				winAlert("X");
			} else if ( sq4.hasClass('O-play') && sq5.hasClass('O-play') && sq6.hasClass('O-play') ) {
				winAlert("O");
			}

			else if ( sq7.hasClass('X-play') && sq8.hasClass('X-play') && sq9.hasClass('X-play') ) {
				winAlert("X");
			} else if ( sq7.hasClass('O-play') && sq8.hasClass('O-play') && sq9.hasClass('O-play') ) {
				winAlert("O");
			}

			else if ( sq1.hasClass('X-play') && sq4.hasClass('X-play') && sq7.hasClass('X-play') ) {
				winAlert("X");
			} else if ( sq1.hasClass('O-play') && sq4.hasClass('O-play') && sq7.hasClass('O-play') ) {
				winAlert("O");
			}

			else if ( sq5.hasClass('X-play') && sq2.hasClass('X-play') && sq8.hasClass('X-play') ) {
				winAlert("X");
			} else if ( sq5.hasClass('O-play') && sq2.hasClass('O-play') && sq8.hasClass('O-play') ) {
				winAlert("O");
			}

			else if ( sq6.hasClass('X-play') && sq9.hasClass('X-play') && sq3.hasClass('X-play') ) {
				winAlert("X");
			} else if ( sq6.hasClass('O-play') && sq9.hasClass('O-play') && sq3.hasClass('O-play') ) {
				winAlert("O");
			}

			else if ( sq1.hasClass('X-play') && sq5.hasClass('X-play') && sq9.hasClass('X-play') ) {
				winAlert("X");
			} else if ( sq1.hasClass('O-play') && sq5.hasClass('O-play') && sq9.hasClass('O-play') ) {
				winAlert("O");
			}

			else if ( sq5.hasClass('X-play') && sq7.hasClass('X-play') && sq3.hasClass('X-play') ) {
				winAlert("X");
			} else if ( sq5.hasClass('O-play') && sq7.hasClass('O-play') && sq3.hasClass('O-play') ) {
				winAlert("O");
			}
		}

		function checkDraw() {

			if ( !($('.tile').hasClass('free')) ) {
				alert("Draw! Try playing again!");
				clearBoard();
			}
		}




		function Oplay() {

			// Function for when O plays tactically
			function Oplaying(square) {

				validatePlay(square)

				if (playValid) {
					square.removeClass('free');
					square.addClass('played');
					square.addClass('O-play');
					square.html("O");
				} else {
					Orandomplay()
				}

			}

			// Function for when O plays randomly
			function Orandomplay() {
				for (var i = 0; i < 10; i++) {
				// Loop to find a valid play
				
					var randomNumber = Math.floor((Math.random() * 9) + 1);
					var randomSquare = $('#square'+randomNumber);
					validatePlay(randomSquare);

					if (playValid) {

						randomSquare.removeClass('free');
						randomSquare.addClass('played');
						randomSquare.addClass('O-play');
						randomSquare.html("O");
						break;
					} 
				}
			}


			// Tactical Plays

			win123_sq3 = ( sq1.hasClass('X-play') && sq2.hasClass('X-play') || sq1.hasClass('O-play') && sq2.hasClass('O-play') ) && !(sq3.hasClass('played'))
			win123_sq2 = ( sq1.hasClass('X-play') && sq3.hasClass('X-play') || sq1.hasClass('O-play') && sq3.hasClass('O-play') ) && !(sq2.hasClass('played'))
			win123_sq1 = ( sq3.hasClass('X-play') && sq2.hasClass('X-play') || sq3.hasClass('O-play') && sq2.hasClass('O-play') ) && !(sq1.hasClass('played'))

			win456_sq6 = ( sq4.hasClass('X-play') && sq5.hasClass('X-play') || sq4.hasClass('O-play') && sq5.hasClass('O-play') ) && !(sq6.hasClass('played'))
			win456_sq5 = ( sq4.hasClass('X-play') && sq6.hasClass('X-play') || sq4.hasClass('O-play') && sq6.hasClass('O-play') ) && !(sq5.hasClass('played'))
			win456_sq4 = ( sq5.hasClass('X-play') && sq6.hasClass('X-play') || sq5.hasClass('O-play') && sq6.hasClass('O-play') ) && !(sq4.hasClass('played'))

			win789_sq9 = ( sq7.hasClass('X-play') && sq8.hasClass('X-play') || sq7.hasClass('O-play') && sq8.hasClass('O-play') ) && !(sq9.hasClass('played'))
			win789_sq8 = ( sq7.hasClass('X-play') && sq9.hasClass('X-play') || sq7.hasClass('O-play') && sq9.hasClass('O-play') ) && !(sq8.hasClass('played'))
			win789_sq7 = ( sq8.hasClass('X-play') && sq9.hasClass('X-play') || sq8.hasClass('O-play') && sq9.hasClass('O-play') ) && !(sq7.hasClass('played'))

			win147_sq7 = ( sq1.hasClass('X-play') && sq4.hasClass('X-play') || sq1.hasClass('O-play') && sq4.hasClass('O-play') ) && !(sq7.hasClass('played'))
			win147_sq4 = ( sq1.hasClass('X-play') && sq7.hasClass('X-play') || sq1.hasClass('O-play') && sq7.hasClass('O-play') ) && !(sq4.hasClass('played'))
			win147_sq1 = ( sq4.hasClass('X-play') && sq7.hasClass('X-play') || sq4.hasClass('O-play') && sq7.hasClass('O-play') ) && !(sq1.hasClass('played'))

			win528_sq8 = ( sq5.hasClass('X-play') && sq2.hasClass('X-play') || sq5.hasClass('O-play') && sq2.hasClass('O-play') ) && !(sq8.hasClass('played'))
			win528_sq2 = ( sq5.hasClass('X-play') && sq8.hasClass('X-play') || sq5.hasClass('O-play') && sq8.hasClass('O-play') ) && !(sq2.hasClass('played'))
			win528_sq5 = ( sq2.hasClass('X-play') && sq8.hasClass('X-play') || sq2.hasClass('O-play') && sq8.hasClass('O-play') ) && !(sq5.hasClass('played'))

			win693_sq3 = ( sq6.hasClass('X-play') && sq9.hasClass('X-play') || sq6.hasClass('O-play') && sq9.hasClass('O-play') ) && !(sq3.hasClass('played'))
			win693_sq9 = ( sq6.hasClass('X-play') && sq3.hasClass('X-play') || sq6.hasClass('O-play') && sq3.hasClass('O-play') ) && !(sq9.hasClass('played'))
			win693_sq6 = ( sq9.hasClass('X-play') && sq3.hasClass('X-play') || sq9.hasClass('O-play') && sq3.hasClass('O-play') ) && !(sq6.hasClass('played'))

			win159_sq9 = ( sq1.hasClass('X-play') && sq5.hasClass('X-play') || sq1.hasClass('O-play') && sq5.hasClass('O-play') ) && !(sq9.hasClass('played'))
			win159_sq5 = ( sq1.hasClass('X-play') && sq9.hasClass('X-play') || sq1.hasClass('O-play') && sq9.hasClass('O-play') ) && !(sq5.hasClass('played'))
			win159_sq1 = ( sq5.hasClass('X-play') && sq9.hasClass('X-play') || sq5.hasClass('O-play') && sq9.hasClass('O-play') ) && !(sq1.hasClass('played'))

			win573_sq3 = ( sq5.hasClass('X-play') && sq7.hasClass('X-play') || sq5.hasClass('O-play') && sq7.hasClass('O-play') ) && !(sq3.hasClass('played'))
			win573_sq5 = ( sq5.hasClass('X-play') && sq3.hasClass('X-play') || sq5.hasClass('O-play') && sq3.hasClass('O-play') ) && !(sq5.hasClass('played'))
			win573_sq7 = ( sq7.hasClass('X-play') && sq3.hasClass('X-play') || sq7.hasClass('O-play') && sq3.hasClass('O-play') ) && !(sq7.hasClass('played'))



			// Win 1 2 3
			if ( win123_sq3 ) {
				Oplaying(sq3)
			} else if ( win123_sq2 ) {
				Oplaying(sq2)
			} else if ( win123_sq1 )  {
				Oplaying(sq1)
			} 
			
			// Win 4 5 6
			else if ( win456_sq6 ) {
				Oplaying(sq6)
			} else if ( win456_sq5 ) {
				Oplaying(sq5)
			} else if ( win456_sq4 ) {
				Oplaying(sq4)
			} 

			// Win 7 8 9 
			else if ( win789_sq9 ) {
				Oplaying(sq9)
			} else if ( win789_sq8 ) {
				Oplaying(sq8)
			} else if ( win789_sq7 ) {
				Oplaying(sq7)
			}

			// Win 1 4 7
			else if ( win147_sq7 ) {
				Oplaying(sq7)
			} else if ( win147_sq4 ) {
				Oplaying(sq4)
			} else if ( win147_sq1 ) {
				Oplaying(sq1)
			}

			// Win 5 2 8
			else if ( win528_sq8 ) {
				Oplaying(sq8)
			} else if ( win528_sq2 ) {
				Oplaying(sq2)
			} else if ( win528_sq5 ) {
				Oplaying(sq5)
			} 

			// Win 6 9 3
			else if ( win693_sq3 ) {
				Oplaying(sq3)
			} else if ( win693_sq9 ) {
				Oplaying(sq9)
			} else if ( win693_sq6 ) {
				Oplaying(sq6)
			}

			// Win 1 5 9
			else if ( win159_sq9 ) {
				Oplaying(sq9)
			} else if ( win159_sq5 ) {
				Oplaying(sq5)
			} else if ( win159_sq1 ) {
				Oplaying(sq1)
			} 

			// Win 5 7 3
			else if ( win573_sq3 ) {
				Oplaying(sq3)
			} else if ( win573_sq7 ) {
				Oplaying(sq7)
			} else if ( win573_sq5 ) {
				Oplaying(sq5)
			} 


			else {
				Orandomplay();
			}
			checkDraw();
			checkWin();
		}

		$('.tile').on('click', function Xplay() {

			validatePlay(this);

			if (playValid) {
				$(this).removeClass('free');
				$(this).addClass('played');
				$(this).addClass('X-play');
				$(this).html("X");

				checkDraw();
				checkWin();
				Oplay();

			} else {
				alert("That square has already been played. Please choose another square");
			}
			
		});
	}		
	
});	