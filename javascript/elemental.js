
class Elemental{
	constructor(){
		this.chart = {
			"fire": {element: "Fire", weakness: "Water", superEffective: "Nature"},
			"water": {element: "Water", weakness: "Thunder", superEffective: "Fire"},
			"earth": {element: "Earth", weakness: "Wind", superEffective: "Thunder"},
			"wind": {element: "Wind", weakness: "Fire", superEffective: "Earth"},
			"nature": {element: "Nature", weakness: "Fire", superEffective: "Water"},
			"thunder": {element: "Thunder", weakness: "Earth", superEffective: "Wind"},
			"holy": {element: "Holy", weakness: "Dark", superEffective: "Dark"}
		};	
	}
}

