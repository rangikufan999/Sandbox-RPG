
class FileManager{
	constructor(){}

	saveFile(name, file){
		localStorage.setItem(name, JSON.stringify(file));
	}

	loadFile(name){
		return JSON.parse(localStorage.getItem(name));
	}

	deleteFile(name){
		for(var key in localStorage){
			if(key == name){
				console.log("File Found");
				console.log("File Deleted");
				localStorage.removeItem(name);
				return;
			}
		}

		console.log("Error: File Not Found");
	}
}