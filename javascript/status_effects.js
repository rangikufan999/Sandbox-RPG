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

					party[index].status.statusEffects.splice(i, 1);
				}else if(party[index].status.statusEffects[i].stats.duration > 0){
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

	/* Check success of status effect to see if it is applied to target*/
	checkSuccess(target, spell){

		if(spell.stats.rate_of_success > 0){

			if(spell.stats.rate_of_success >= 1){
					target.status.statusEffects.push(spell.stats.status_effect);
					log.print(target.profile.name + " has " + spell.stats.status_effect.details.name);
			}else if(spell.stats.rate_of_success < 1){
				if(dieRoll.chanceRoll(100) > 100 - (spell.stats.rate_of_success * 100)){
					target.status.statusEffects.push(spell.stats.status_effect);
					log.print(target.profile.name + " has " + spell.stats.status_effect.details.name);
				}
			}
		}
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