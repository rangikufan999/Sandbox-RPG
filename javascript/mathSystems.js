class Crit{
	constructor(){}

	calculateCrit(chance, initialDamage){
		if(dieRoll.chanceRoll(100) >= ((100) - (chance * 100))){
			log.print("Critcal Strike!");
			var damage = crit.processCrit(initialDamage);
			return damage;
		}else{
			return initialDamage;
		}
	}

	processCrit(damage){
		return damage * 2;
	}
}

class DamageBonus{
	constructor(){}

	weakTo(damage){
		return damage * 0.5;
	}

	neutralTo(damage){
		return damage * 1.0;
	}

	strongTo(damage){
		return damage * 1.5;
	}

	superStrongTo(damage){
		return damage * 2.0;
	}
}