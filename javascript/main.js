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
	constructor(accountName, party = [], inventory = [], area = {placeholder: "string"}){
		this.accountName = accountName;
		this.party = party;
		this.inventory = inventory;
		this.area = area;
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

	randomizeParty(size, mobData){
		var size = dieRoll.chanceRoll(3);
		this.party = [];
		console.log("Party size is: " + size);

		for(var i = 0;i<size;i++){
			this.party.push(mobData[dieRoll.roll(mobData.length)]);
		}	 	
	}

	createActor(name, img, baseClass, baseName, level, element, race, archetype, crit){
		switch(baseName){
			case "warrior":
				return new Actor(
					name, 
					img, 
					this.scaleMob(level, baseClass.health, 0.10),
					this.scaleMob(level, baseClass.maxHealth, 0.10),
					this.scaleMob(level, baseClass.mana, 0.04),
					this.scaleMob(level, baseClass.maxMana, 0.04),
					this.scaleMob(level, baseClass.sp, 0.07),
					this.scaleMob(level, baseClass.maxSp, 0.07),
					baseClass.ultimate,
					baseClass.maxUltimate,
					level,
					element,
					race,
					archetype,
					this.scaleMob(level, baseClass.attack, 0.08),
					this.scaleMob(level, baseClass.defense, 0.06),
					this.scaleMob(level, baseClass.magic, 0.03),
					this.scaleMob(level, baseClass.resistance, 0.02),
					crit
					);
			break;

			case "mage":
				return new Actor(
					name, 
					img, 
					this.scaleMob(level, baseClass.health, 0.07),
					this.scaleMob(level, baseClass.maxHealth, 0.07),
					this.scaleMob(level, baseClass.mana, 0.09),
					this.scaleMob(level, baseClass.maxMana, 0.09),
					this.scaleMob(level, baseClass.sp, 0.05),
					this.scaleMob(level, baseClass.maxSp, 0.05),
					baseClass.ultimate,
					baseClass.maxUltimate,
					level,
					element,
					race,
					archetype,
					this.scaleMob(level, baseClass.attack, 0.03),
					this.scaleMob(level, baseClass.defense, 0.02),
					this.scaleMob(level, baseClass.magic, 0.08),
					this.scaleMob(level, baseClass.resistance, 0.05),
					crit
					);
			break;

			case "healer":
				return new Actor(
					name, 
					img, 
					this.scaleMob(level, baseClass.health, 0.08),
					this.scaleMob(level, baseClass.maxHealth, 0.08),
					this.scaleMob(level, baseClass.mana, 0.09),
					this.scaleMob(level, baseClass.maxMana, 0.09),
					this.scaleMob(level, baseClass.sp, 0.06),
					this.scaleMob(level, baseClass.maxSp, 0.06),
					baseClass.ultimate,
					baseClass.maxUltimate,
					level,
					element,
					race,
					archetype,
					this.scaleMob(level, baseClass.attack, 0.03),
					this.scaleMob(level, baseClass.defense, 0.04),
					this.scaleMob(level, baseClass.magic, 0.07),
					this.scaleMob(level, baseClass.resistance, 0.07),
					crit
					);
			break;
		}
	}

	scaleMob(level, mobStat, multiplier){
		var stat = mobStat;
		for(var i = 0;i<level;i++){
			stat += Math.ceil(stat * multiplier);
		}

		return stat;
	}
}



var defaults = new Defaults(3000,3000, 3000, 1,70,10,15,0,0,0,30);

