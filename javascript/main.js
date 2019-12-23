//** Default Value Class **//
class Defaults{
	constructor(health, mana, sp, level, attack, defense, magic, resistance, exp, expNeeded){
	 	this.health = health;
	 	this.mana = mana;
	 	this.sp = sp;
	 	this.level = level;
	 	this.attack = attack;
	 	this.defense = defense;
	 	this.magic = magic;
	 	this.resistance = resistance;
	 	this.exp = exp;
	 	this.expNeeded = expNeeded;
	}
}

//** Player Class **//

class Player{
	constructor(accountName, party = []){
		this.accountName = accountName;
		this.party = party;
	}
}

//** Hero and Enemy Class **//
class Actor{
	constructor(name, img, health = defaults.health, maxHealth = defaults.health, mana = defaults.mana, maxMana = defaults.mana, sp = defaults.sp, maxSp = defaults.maxSp, level = defaults.level, attack = defaults.attack, defense = defaults.defense, magic = defaults.magic, resistance = defaults.resistance, statusEffects = [], abilities = []){

		this.profile = {
			name: name,
			img: img,
			health: health,
			maxHealth: maxHealth,
			mana: mana,
			maxMana: maxMana,
			sp: sp,
			maxSp: maxSp,
			level: level
		};

		this.stats = {
			attack: attack,
			defense: defense,
			magic: magic,
			resistance: resistance
		};

		this.status ={
			statusEffects: statusEffects
		};

		this.abilities = abilities;
	}
}

class Hero extends Actor{
	constructor(name, img, exp = defaults.exp, expNeeded = defaults.expNeeded, health, maxHealth, mana, maxMana, sp, maxSp, level, attack, defense, magic, resistance, statusEffects){
		super(name, img, health, maxHealth, mana, maxMana, sp, maxSp, level, attack, defense, magic, resistance, statusEffects);
		this.profile.exp = exp;
		this.profile.expNeeded = expNeeded;
		
	}
}

class EnemyParty{
	constructor(party = []){
		this.party = party;
	}
}



var defaults = new Defaults(3000,3000, 3000, 1,20,10,15,0,0,30);

