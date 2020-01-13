//** Default Value Class **//
class Defaults{
	constructor(health, mana, sp, level, attack, defense, magic, resistance, crit, exp, expNeeded){
	 	this.health = health;
	 	this.mana = mana;
	 	this.sp = sp;
	 	this.level = level;
	 	this.attack = attack;
	 	this.defense = defense;
	 	this.magic = magic;
	 	this.resistance = resistance;
	 	this.crit = crit;
	 	this.exp = exp;
	 	this.expNeeded = expNeeded;
	}
}

//** Player Class **//

class Player{
	constructor(accountName, party = [], inventory = []){
		this.accountName = accountName;
		this.party = party;
		this.inventory = inventory;
	}
}

//** Hero and Enemy Class **//
class Actor{
	constructor(name, img, health = defaults.health, maxHealth = defaults.health, mana = defaults.mana, maxMana = defaults.mana, sp = defaults.sp, maxSp = defaults.sp, ultimate = 0, maxUltimate = 10, level = defaults.level, element = "Earth", race = "Gnome", archetype = "Warrior", attack = defaults.attack, defense = defaults.defense, magic = defaults.magic, resistance = defaults.resistance, crit = defaults.crit, statusEffects = [], abilities = []){

		this.profile = {
			name: name,
			img: img,
			health: health,
			maxHealth: maxHealth,
			mana: mana,
			maxMana: maxMana,
			sp: sp,
			maxSp: maxSp,
			ultimate: ultimate,
			maxUltimate: maxUltimate,
			level: level,
			element: element,
			race: race,
			archetype: archetype
		};

		this.stats = {
			attack: attack,
			defense: defense,
			magic: magic,
			resistance: resistance,
			crit: crit
		};

		this.status ={
			statusEffects: statusEffects
		};

		this.abilities = abilities;
	}
}

class Hero extends Actor{
	constructor(name, img, exp = defaults.exp, expNeeded = defaults.expNeeded, health, maxHealth, mana, maxMana, sp, maxSp, ultimate, maxUltimate, level, element, race, archetype, attack, defense, magic, resistance, crit, statusEffects){
		super(name, img, health, maxHealth, mana, maxMana, sp, maxSp, ultimate, maxUltimate, level, element, race, archetype, attack, defense, magic, resistance, crit, statusEffects);
		this.profile.exp = exp;
		this.profile.expNeeded = expNeeded;
		
	}
}

class EnemyParty{
	constructor(party = []){
		this.party = party;
	}
}



var defaults = new Defaults(3000,3000, 3000, 1,70,10,15,0,0,0,30);

