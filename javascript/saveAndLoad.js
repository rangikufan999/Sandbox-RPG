
class fileManager{
	constructor(){}

	saveFile(name, file){
		localStorage.setItem(name, JSON.stringify(file));
	}

	getFile(name){
		return localStorage.getItem(name);
	}
}