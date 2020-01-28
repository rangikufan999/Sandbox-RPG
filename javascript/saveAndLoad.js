
class FileManager{
	constructor(){}

	saveFile(name, file){
		localStorage.setItem(name, JSON.stringify(file));
	}

	loadFile(name){
		return JSON.parse(localStorage.getItem(name));
	}
}