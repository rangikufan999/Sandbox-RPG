//** Status Effects **//
/* Statuses: Incapacitate, Disorient, OverTime, Debuff, Buff */
class StatusEffect{
	constructor(name, tooltip, category, subCategory, duration, amount, stat){
		this.details = {
			name: name,
			tooltip: tooltip
		};

		this.identity = {
			category: category,
			subCategory: subCategory
		};

		this.stats = {
			duration: duration,
			amount: amount,
			stat: stat
		}
	}
}

class StatusController{
	constructor(){}

	/* Check status effect durations, tick counters, run mechanic, remove expired effects, determine if eligible for turn. */
	checkStatus(index){
		var party = combat.currentTurn == 0 ? player.party : enemyParty.party;
		var affiliation = combat.currentTurn == 0 ? "actor" : "enemy";
		var takeTurn = true;

		if(combat.checkDeathStatus(party[index]) == false && party[index].status.statusEffects.length > 0){
			
			for(var i = (party[index].status.statusEffects.length - 1);i > -1;i--){
				if(party[index].status.statusEffects[i].stats.duration == 0){
					if(party[index].status.statusEffects[i].category == "Buff"){
						if(party[index].status.statusEffects[i].subCategory == "buff"){
							stat.modifyStat(party[index], party[index].status.statusEffects[i].stats.stat, "debuff", party[index].status.statusEffects[i].stats.amount);
							party[index].status.statusEffects.splice(i, 1);
						}else if(party[index].status.statusEffects[i].subCategory == "debuff"){
							stat.modifyStat(party[index], party[index].status.statusEffects[i].stats.stat, "buff", party[index].status.statusEffects[i].stats.amount);
							party[index].status.statusEffects.splice(i, 1);
						}

					}else{
						party[index].status.statusEffects.splice(i, 1);
					}
				}else if(party[index].status.statusEffects[i].stats.duration > 0){
					console.log(party[index].profile.name + " duration at " + party[index].status.statusEffects[i].stats.duration);
					party[index].status.statusEffects[i].stats.duration -= 1;
					takeTurn = stat.callStatusMechanic(party[index], party[index].status.statusEffects[i], affiliation);

				}
			}
		}
		/* add checks for num-flag to either 0:run turn as normal, 1: skip that actors turn, or 2: random attack any target */
		if(takeTurn == true){
			return true;
		}else if(takeTurn == false){
			return false;
		}
	}

	callStatusMechanic(target, effect, affiliation){
		var category = effect.identity.category;

		switch(category){
			/* Provide solution to when an actor has incapacitate and disorient at the same time; solution: add check for incapacitate to disorient*/
			case "Incapacitate":
				log.print(target.profile.name + " is incapacitated and cannot take their turn!");
				return false;
			break;

			case "Disorient":
				var result = dieRoll.roll(2);
				var party = dieRoll.roll(2) == 0 ? player.party : enemyParty.party;
				var aff = combat.currentTurn == 0 ? "actor" : "enemy";

				if(result == 0){
					var victim = dieRoll.roll(party.length);
					combat.dealDamage(target, party[victim], aff);
					log.print(target.profile.name + " flailed in confusion striking at random!");
					return false;
				}
			break;

			case "OverTime":
				if(effect.identity.subCategory == "dot"){
					combat.dealRawDamage(target, effect.stats.amount, affiliation);
					if(target.profile.health < 0){
						target.profile.health = 1;
					}
					displayer.updateHealth(target, affiliation);
					log.print(target.profile.name + " took " + effect.stats.amount + " damage from " + effect.details.name + "!");
					
				}else if(effect.identity.subCategory == "hot"){
					combat.dealRawHealing(target, effect.stats.amount, affiliation);
					if(target.profile.health > target.profile.maxHealth){
						target.profile.health = target.profile.maxHealth;
					}
					displayer.updateHealth(target, affiliation);
					log.print(target.profile.name + " restored " + effect.stats.amount + " health from " + effect.details.name + "!");
				}
			break;
		}

		return true;
	}

	modifyStat(target, stat, buffType, amount){
		switch(stat){
			case "attack":
				if(buffType == "buff"){
					target.stats.attack += amount;
				}else if(buffType == "debuff"){
					target.stats.attack -= amount;
				}				
			break;

			case "defense":
				if(buffType == "buff"){
					target.stats.defense += amount;
				}else if(buffType == "debuff"){
					target.stats.defense -= amount;
				}
			break;

			case "magic":
				if(buffType == "buff"){
					target.stats.magic += amount;
				}else if(buffType == "debuff"){
					target.stats.magic -= amount;
				}
			break;

			case "resistance":
				if(buffType == "buff"){
					target.stats.resistance += amount;
				}else if(buffType == "debuff"){
					target.stats.resistance -= amount;
				}
			break;

			case "health":
				if(buffType == "buff"){
					target.profile.health += amount;
					target.profile.maxHealth += amount;
					if(target.profile.health > target.profile.maxHealth){
						target.profile.health = target.profile.maxHealth;
					}
				}else if(buffType == "debuff"){
					target.profile.health -= amount;
					target.profile.maxHealth -= amount;
					if(target.profile.health < 0){
						target.profile.health == 10;
					}
				}	
			break;

			case "mana":
				if(buffType == "buff"){
					target.profile.mana += amount;
					target.profile.maxMana += amount;
					if(target.profile.mana > target.profile.maxMana){
						target.profile.mana = target.profile.maxMana;
					}
				}else if(buffType == "debuff"){
					target.profile.mana -= amount;
					target.profile.maxMana -= amount;
					if(target.profile.mana < 0){
						target.profile.mana == 0;
					}
				}
			break;

			case "sp":
				if(buffType == "buff"){
					target.profile.sp += amount;
					target.profile.maxSp += amount;
					if(target.profile.sp > target.profile.maxSp){
						target.profile.sp = target.profile.maxSp;
					}
				}else if(buffType == "debuff"){
					target.profile.sp -= amount;
					target.profile.maxSp -= amount;
					if(target.profile.sp < 0){
						target.profile.sp = 0;
					}
				}
			break;

			case "crit":
				if(buffType == "buff"){
					target.stats.crit += amount;
				}else if(buffType == "debuff"){
					target.stats.crit -= amount;
				}
			break;
		}
	}

	/* Check success of status effect to see if it is applied to target*/
	checkSuccess(target, spell){

		if(spell.stats.rate_of_success > 0){
			if(spell.stats.rate_of_success >= 1){
				if(spell.stats.status_effect.identity.category == "Buff"){
					stat.modifyStat(target, spell.stats.status_effect.stats.stat, spell.stats.status_effect.identity.subCategory, spell.stats.status_effect.stats.amount);
					target.status.statusEffects.push(stat.returnNewStatusEffect(spell));
					log.print(target.profile.name + " has " + spell.stats.status_effect.details.name);
				}else{
					target.status.statusEffects.push(stat.returnNewStatusEffect(spell));
					log.print(target.profile.name + " has " + spell.stats.status_effect.details.name);
				}
			}else if(spell.stats.rate_of_success < 1){
				if(dieRoll.chanceRoll(100) > 100 - (spell.stats.rate_of_success * 100)){
					target.status.statusEffects.push(stat.returnNewStatusEffect(spell));
					log.print(target.profile.name + " has " + spell.stats.status_effect.details.name);
				}
			}
		}
	}

	returnNewStatusEffect(spell){
		return new StatusEffect(spell.stats.status_effect.details.name, spell.stats.status_effect.details.tooltip, spell.stats.status_effect.identity.category, spell.stats.status_effect.identity.subCategory, spell.stats.status_effect.stats.duration, spell.stats.status_effect.stats.amount, spell.stats.status_effect.stats.stat);
	}

	/* Not Sure Yet if needed */
	incapacitate(){
		//
	}

	/* determine if randomly attacks, attacks allies, or takes turn */
	disorient(){
		//
	}
	/* deal damage or heal damage before taking turn. */
	overTime(){
		//
	}
}