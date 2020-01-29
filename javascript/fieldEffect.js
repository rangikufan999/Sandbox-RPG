class Field{
	constructor(name, tooltip, advantages, disadvantages, effect, amount, buff, debuff){
		this.name = name;
		this.tooltip = tooltip;
		this.advantages = advantages;
		this.disadvantages = disadvantages;
		this.effect = effect;
		this.amount = amount;
		this.buff = buff;
		this.debuff = debuff;
	}

	initiateFieldTurn(){
		switch(this.effect){
			case "damageOrHeal":
				for(var i =0;i<player.party.length;i++){
					
					for(var x = 0;x<this.advantages.length;x++){
						if(player.party[i].profile.element == this.advantages[x]){
							log.print("Field Effect doing player healing...");
							combat.dealRawHealing(player.party[i], this.amount, "actor");
						}
					}

					for(var y = 0;y<this.disadvantages.length;y++){
						if(player.party[i].profile.element == this.disadvantages[y]){
							log.print("Field Effect doing player damage...");
							combat.dealRawDamage(player.party[i], this.amount, "actor");
						}
					}
				}

				for(var i = 0;i<enemyParty.party.length;i++){
					for(var x = 0;x<this.advantages.length;x++){
						if(enemyParty.party[i].profile.element == this.advantages[x]){
							log.print("Field Effect doing enemy healing...");
							combat.dealRawHealing(enemyParty.party[i], this.amount, "enemy");
						}
					}

					for(var y = 0;y<this.disadvantages.length;y++){
						if(enemyParty.party[i].profile.element == this.disadvantages[y]){
							log.print("Field Effect doing enemy damage...");
							combat.dealRawDamage(enemyParty.party[i], this.amount, "enemy");
						}
					}
				}

				combat.fieldEffectTurn = 0;
				combat.initiateTurn();
			break;

			case "buffOrDebuff":
				for(var i =0;i<player.party.length;i++){
					
					for(var x = 0;x<this.advantages.length;x++){
						if(player.party[i].profile.element == this.advantages[x]){
							log.print("Field Effect applying player buff...");
							stat.determineAddBuff(player.party[i], this.buff);
						}
					}

					for(var y = 0;y<this.disadvantages.length;y++){
						if(player.party[i].profile.element == this.disadvantages[y]){
							log.print("Field Effect applying player debuff...");
							stat.determineAddBuff(player.party[i], this.debuff);
						}
					}
				}

				for(var i = 0;i<enemyParty.party.length;i++){
					for(var x = 0;x<this.advantages.length;x++){
						if(enemyParty.party[i].profile.element == this.advantages[x]){
							log.print("Field Effect applying enemy buff...");
							stat.determineAddBuff(enemyParty.party[i], this.buff);
						}
					}

					for(var y = 0;y<this.disadvantages.length;y++){
						if(enemyParty.party[i].profile.element == this.disadvantages[y]){
							log.print("Field Effect applying enemy debuff...");
							stat.determineAddBuff(enemyParty.party[i], this.debuff);
						}
					}
				}

				combat.fieldEffectTurn = 0;
				combat.initiateTurn();
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