//** Log Class **//

class Log{
	constructor(){};

	print(message){
		$(".log_container").prepend("<p>" + message + "</p>");
	}
}