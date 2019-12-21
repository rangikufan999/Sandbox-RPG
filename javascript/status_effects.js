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
	checkStatus(){
		var party = combat.currentTurn == 1 ? player.party : enemyParty.party;

		for(var i = 0;i < party.status.length;i++){

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
					alert("checkpoint");
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