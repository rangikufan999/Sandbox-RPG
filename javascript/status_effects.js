//** Status Effects **//
/* Statuses: Incapacitate, Disorient, OverTime, Debuff, Buff */
class StatusEffect{
	constructor(name, tooltip, category, duration, amount, stat){
		this.details = {
			name: name,
			tooltip: tooltip
		};

		this.identity = {
			category: category
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
		var party = combat.currentTurn == 1 ? player.party : enemyParty.party;
		/* affiliation ternary operator */

		for(var i = (party[index].status.statusEffects.length - 1);i > -1;i--){
			if(party[index].status.statusEffects[i].stats.duration == 0){
				party[index].status.statusEffects.splice(i, 0);
			}else if(party[index].status.statusEffects[i].stats.duration > 0){
				party[index].status.statusEffects[i].stats.duration -= 1;
				stat.callStatusMechanic(party[index], party[index].status.statusEffect[i]);
			}
		}

		/* add checks for num-flag to either 0:run turn as normal, 1: skip that actors turn, or 2: random attack any target */
	}

	callStatusMechanic(target, effect, affiliation){
		var category = effect.identity.category;
		switch(category){
			/* Provide solution to when an actor has incapacitate and disorient at the same time; solution: add check for incapacitate to disorient*/
			case "Incapacitate":

			break;

			case "Disorient":

			break;

			case "OverTime":

			break;
		}
	}

	/* Check success of status effect to see if it is applied to target*/
	checkSuccess(target, spell){

		if(spell.stats.rate_of_success > 0){

			if(spell.stats.rate_of_success >= 1){
					target.statusEffects = [];
					target.statusEffects.push(spell.stats.status_effect);
					log.print(target.profile.name + " has " + spell.stats.status_effect.details.name);
			}else if(spell.stats.rate_of_success < 1){
				if(dieRoll.chanceRoll(100) > 100 - (spell.stats.rate_of_success * 100)){
					target.statusEffects = [];
					target.statusEffects.push(spell.stats.status_effect);
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