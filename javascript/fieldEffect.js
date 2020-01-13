class Fields{
	constructor(name, tooltip, advantages, disadvantages, effect){
		this.name = name;
		this.tooltip = tooltip;
		this.advantages = advantages;
		this.disadvantages = disadvantages;
		this.effect = effect;
	}

	intitiateFieldTurn(){
		switch(this.effect){
			case "damageOrHeal":
				for(var i =0;i<player.party.length;i++){
					for(var x = 0;x<this.advantages.length;x++){
						if(player.party[i].profile.type == this.advantages[x]){
							combat.dealRawHealing(player.party[i], this.amount, "actor");
						}
					}

					for(var y = 0;y<this.disadvantages.length;y++){
						if(player.party[i].profile.type == this.disadvantages[x]){
							combat.dealRawDamage(player.party[i], this.amount, "actor");
						}
					}
				}

				for(var i = 0;i<enemyParty.party.length;i++){
					for(var x = 0;x<this.advantages.length;x++){
						if(enemyParty.party[i].profile.type == this.advantages[x]){
							combat.dealRawHealing(enemyParty.party[i], this.amount, "enemy");
						}
					}

					for(var y = 0;y<this.disadvantages.length;y++){
						if(enemyParty.party[i].profile.type == this.disadvantages[x]){
							combat.dealRawDamage(enemyParty.party[i], this.amount, "enemy");
						}
					}
				}
			break;

			case "buffOrDebuff":

			break;

			case "avatar":

			break;
		}
	}
}


//Combat class property fieldEffectTurn keeps track of when field effect goes off.
//All units need a type for this field effect to check.
//Damage-Healing, Buff-Debuff, Avatar-System
//