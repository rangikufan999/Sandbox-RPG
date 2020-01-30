//** Die Roll Class **//

class DieRoll{
	constructor(){};

	roll(maxVal){
		return Math.floor(Math.random() * maxVal);
	}

	chanceRoll(maxVal){
		return Math.ceil(Math.random() * maxVal);
	}
}

