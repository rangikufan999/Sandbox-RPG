//** Log Class **//

class Log{
	constructor(colorFlag){
	};

	print(message){
		$(".log_container").prepend("<p>" + message + "</p>");
	}
}