//** Abilities Class **//

class Ability{
	constructor(name, tooltip, rank, modify_type, target_type, ability_type, ultimate, mana_cost, amount, crit_rate, status_effect, rate_of_success){
		this.details = {
			name: name,
			tooltip: tooltip,
			rank: rank
		};

		this.identity = {

			/* modify_type determines whether it is damage, healing, or utility */
			modify_type: modify_type,
			/* target_type determines whether it is single target or multi-target */
			target_type: target_type,
			/* ability_type determines whether it is a special or a spell or an ultimate */
			ability_type: ability_type,

			ultimate: ultimate
		};

		this.stats = {
			mana_cost: mana_cost,
			amount: amount,
			crit_rate: crit_rate,
			status_effect: status_effect,
			rate_of_success: rate_of_success
		};
	}
}

