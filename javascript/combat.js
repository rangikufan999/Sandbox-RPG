//** Combat Class **//

class Combat{
	constructor(currentTurn, playerQueue, gameOver){
		this.currentTurn = currentTurn;
		this.playerQueue = playerQueue;
		this.gameOver = gameOver;
	}


	/* Change statusEffects == "DEAD" or != "DEAD" to function check for "DEAD" status object */
	initiateTurn(){
		if(this.currentTurn == 0 && this.gameOver == false){
			log.print("Player's Turn! Select an action!");
			var takeTurn = stat.checkStatus(this.playerQueue);
			if(this.checkDeathStatus(player.party[this.playerQueue]) == false && takeTurn != false){
				displayer.displayOptions();
			}else if(this.checkDeathStatus(player.party[this.playerQueue]) == true || takeTurn == false){
				this.playerQueue += 1;
				if(this.playerQueue >= player.party.length){
					this.currentTurn = 1;
					this.initiateTurn();
					$("#targets").hide();
					$("#targetSubmit").hide();
				}else if(this.playerQueue < player.party.length){
					this.initiateTurn();
				}
			}
		}else if(this.currentTurn == 1 && this.gameOver == false){
			log.print("Enemy's Turn! Here they come!");
			var i = 0;
			var comb = setInterval(function(){
				if(i<enemyParty.party.length && combat.gameOver == false){
					var takeTurn = stat.checkStatus(i);
					if(combat.checkDeathStatus(enemyParty.party[i]) == false && takeTurn != false){
						combat.dealDamage(enemyParty.party[i], player.party[dieRoll.roll(player.party.length)], "actor");
						i += 1;
					}else if(combat.checkDeathStatus(enemyParty.party[i]) == true || takeTurn == false){
						
						i += 1;
					}
				}
				else if(i>=enemyParty.party.length && combat.gameOver == false){
					clearInterval(comb);
					setTimeout(function(){
						combat.currentTurn = 0;
						combat.playerQueue = 0;
						combat.initiateTurn();
					},500)
				}else if(combat.gameOver == true){
					clearInterval(comb);
					setTimeout(function(){
						combat.currentTurn = 0;
						combat.playerQueue = 0;
						combat.initiateTurn();
					}, 500)
				}
			}, 1200);	
		}else if(this.gameOver == true){
			log.print("Game Over");
		}
	}

	defaultOutResource(target, stat){
		if(stat == "health"){
			if(target.profile.health < 0){
				target.profile.health = 0;
				target.status.statusEffects = [];
				target.status.statusEffects.push(combat.generateDeathStatus());
			}
		}else if(stat == "mana"){
			if(target.profile.mana < 0){
				target.profile.mana = 0;
			}
		}else if(stat == "sp"){
			if(target.profile.sp < 0){
				target.profile.sp = 0;
			}
		}else if(stat == "ultimate"){
			if(target.profile.ultimate < 0){
				target.profile.ultimate = 0;
			}
		}
	}

	maxOutResource(target, stat){
		if(stat == "health"){
			if(target.profile.health > target.profile.maxHealth){
				target.profile.health = target.profile.maxHealth;
			}
		}else if(stat == "mana"){
			if(target.profile.mana > target.profile.maxMana){
				target.profile.mana = target.profile.maxMana;
			}
		}else if(stat == "sp"){
			if(target.profile.sp > target.profile.maxSp){
				target.profile.sp = target.profile.maxSp;
			}
		}else if(stat == "ultimate"){
			if(target.profile.ultimate > target.profile.maxUltimate){
				target.profile.ultimate = target.profile.maxUltimate;
			}
		}
	}


	dealDamage(attacker, defender, affiliation){
		var damage = Math.floor(attacker.stats.attack - (damageReduction.calculatePhysicalDamageReduction(defender.stats.defense)));
		var attackerAffiliation = combat.currentTurn == 0 ? "actor" : "enemy";
		damage = crit.calculateCrit(attacker.stats.crit, damage);
		defender.profile.health -= damage;
		attacker.profile.ultimate += 10;
		combat.maxOutResource(attacker, "ultimate");
		log.print(attacker.profile.name + " dealt " + damage + " to " + defender.profile.name + "!");
		combat.defaultOutResource(defender, "health");

		displayer.updateUltimateBar(attacker, attackerAffiliation);
		displayer.updateHealth(defender, affiliation)
		combat.checkGameOver(player,enemyParty);
	}

	/* For Dots that deal purely raw damage unaffected by stats. */

	dealRawDamage(target, damage, affiliation){
		target.profile.health -= damage;

		combat.defaultOutResource(target);
		displayer.updateHealth(target, affiliation);
		combat.checkGameOver(player,enemyParty);
	}

	spellDamage(caster, defender, affiliation, spell, ability_type){
		var damage;
		if(spell.identity.ability_type == "spell"){
			damage = Math.floor((caster.stats.magic + spell.stats.amount) - (damageReduction.calculateMagicalDamageReduction(defender.stats.resistance)));
		}else if(spell.identity.ability_type == "special"){
			damage = Math.floor((caster.stats.attack + spell.stats.amount) - (damageReduction.calculatePhysicalDamageReduction(defender.stats.defense)));	
		}

		defender.profile.health -= damage;
		
		log.print(caster.profile.name + " dealt " + damage + " to " + defender.profile.name + "!");
		combat.defaultOutResource(defender, "health");
		displayer.updateHealth(defender, affiliation)
		combat.checkGameOver(player,enemyParty);
	}

	itemDamage(item, target, affiliation){
		target.profile.health -= item.stats.amount;
		combat.defaultOutResource(target, "health");
		inv.reduceItemQuantity(item);
		log.print(player.party[combat.playerQueue].profile.name + " used a " + item.details.name + " and did " + item.stats.amount + " damage to " + target.profile.name + "!");
		displayer.updateHealth(target, affiliation);
		combat.checkGameOver(player,enemyParty);
	}

	dealRawHealing(target, healing, affiliation){
		target.profile.health += healing;
		combat.maxOutResource(target, "health");
		displayer.updateHealth(target, affiliation);
	}

	healDamage(healer, patient, heal_amount, affiliation){
		var healing = Math.floor(healer.stats.magic + heal_amount);
		patient.profile.health += healing;
		combat.maxOutResource(patient, "health");

		log.print(healer.profile.name + " restored " + heal_amount + " health to " + patient.profile.name + "!");
		displayer.updateHealth(patient, affiliation);
	}

	itemHealing(item, target, affiliation){
		combat.selectStat(target, item.stats.stat, item.stats.amount, "healing");
		inv.reduceItemQuantity(item);
		log.print(target.profile.name + " restored " + item.stats.amount + " health by using (a)" + item.details.name + "!");
		displayer.updateHealth(target, affiliation);
	}

	selectStat(target, stat, amount, modify_type){

		switch(stat){
			case "health":
				if(modify_type == "healing"){
					alert("got here");
					target.profile.health += amount;
					combat.maxOutResource(target, "health");
				}
			break;

			case "mana":
				if(modify_type == "healing"){
					target.profile.mana += amount;
					combat.maxOutResource(target, "mana");
				}
			break;

			case "sp":
				if(modify_type == "healing"){
					target.profile.sp += amount;
					combat.maxOutResource(target, "sp");
				}
			break;
		}
	}

	reduceMana(caster, spell, affiliation){
		caster.profile.mana -= spell.stats.mana_cost;
		if(caster.profile.mana < 0){caster.profile.mana = 0;}
		displayer.updateMana(caster, affiliation);
	}

	reduceSp(caster, spell, affiliation){
		caster.profile.sp -= spell.stats.mana_cost;
		if(caster.profile.sp < 0){caster.profile.sp = 0}
		displayer.updateSp(caster, affiliation);
	}

	reduceUltimate(caster, affiliation){
		caster.profile.ultimate = 0;
		displayer.updateUltimateBar(caster, affiliation);
	}

	applyUtility(item, target){
		switch(item.identity.utility){
			case "clear":
				target.status.statusEffects = [];
				log.print(target.profile.name + "'s status has been restored!");
				inv.reduceItemQuantity(item);
			break;

			//Add More Cases for status effects here.
		}
	}

	

	checkGameOver(playerTeam, enemyTeam){
		var playerDeathCount = 0;
		var enemyDeathCount = 0;
		for(var i = 0;i<playerTeam.party.length;i++){
			if(playerTeam.party[i].profile.health <=0){	
				playerDeathCount += 1;
			}	
		}

		for(var i = 0;i<enemyTeam.party.length;i++){
			if(enemyTeam.party[i].profile.health <=0){
				enemyDeathCount += 1;
			}
		}

		if(playerDeathCount == playerTeam.party.length || enemyDeathCount == enemyTeam.party.length){
			this.gameOver = true;
		}
	}

	/* Generate a death status effect object when an actor dies */
	generateDeathStatus(){
		return new StatusEffect("Dead", "This unit has perished and cannot participate in combat anymore.", "Death", 0, 0, "NONE");
	}

	/* Check if Death Status Effect exists and return true or false */
	checkDeathStatus(target){
		if(target.status.statusEffects.length > 0){
			for(var i = 0;i< target.status.statusEffects.length;i++){
				if(target.status.statusEffects[i].identity.category == "Death"){
					return true;
				}
			}

			return false;
		}else{
			return false;
		}	
	}
}

class Actions{
	constructor(){};

	attack(){
		displayer.displayTargetSelection(enemyParty.party, "attack");	
	}

	ability(){
		displayer.displayAbilitySelection(player.party[combat.playerQueue], "non-ult");
	}

	items(){
		displayer.displayItemsSelection(player.inventory);
	}

	ultimate(){
		displayer.displayAbilitySelection(player.party[combat.playerQueue], "ult");
	}

	determineTarget(target, action_type, spell){
		if(action_type == "attack"){
			combat.dealDamage(player.party[combat.playerQueue], target, "enemy");
		}else if(action_type == "ability"){
			if(spell.identity.ability_type == "spell"){
				if(spell.identity.modify_type == "damage"){

					combat.spellDamage(player.party[combat.playerQueue], target, "enemy", spell, "special");
					stat.checkSuccess(target, spell);
				}else if(spell.identity.modify_type == "healing"){
					combat.healDamage(player.party[combat.playerQueue], target, spell.stats.amount, "actor");
					stat.checkSuccess(target, spell);
				}
				combat.reduceMana(player.party[combat.playerQueue], spell, "actor");
			}else if(spell.identity.ability_type == "special"){
				if(spell.identity.modify_type == "damage"){
					combat.spellDamage(player.party[combat.playerQueue], target, "enemy", spell, "special");
					stat.checkSuccess(target, spell);
				}else if(spell.identity.modify_type == "healing"){
					combat.healDamage(player.party[combat.playerQueue], target, spell.stats.amount, "actor");
					stat.checkSuccess(target, spell);
				}
				combat.reduceSp(player.party[combat.playerQueue], spell, "actor");
			}


		}else if(action_type == "item"){
			if(spell.identity.modify_type == "damage"){
				combat.itemDamage(spell, target, "enemy");
			}else if(spell.identity.modify_type == "healing"){
				combat.itemHealing(spell, target, "actor");
			}else if(spell.identity.modify_type == "utility" || spell.identity.modify_type == "utility_ally" || spell.identity.modify_type == "utility_enemy"){
				combat.applyUtility(spell, target);
			}
		}else if(action_type == "ultimate"){
			if(spell.identity.ability_type == "spell"){
				if(spell.identity.modify_type == "damage"){

					combat.spellDamage(player.party[combat.playerQueue], target, "enemy", spell, "special");
					stat.checkSuccess(target, spell);
				}else if(spell.identity.modify_type == "healing"){
					combat.healDamage(player.party[combat.playerQueue], target, spell.stats.amount, "actor");
					stat.checkSuccess(target, spell);
				}
				combat.reduceUltimate(player.party[combat.playerQueue], "actor");
			}else if(spell.identity.ability_type == "special"){
				if(spell.identity.modify_type == "damage"){
					combat.spellDamage(player.party[combat.playerQueue], target, "enemy", spell, "special");
					stat.checkSuccess(target, spell);
				}else if(spell.identity.modify_type == "healing"){
					combat.healDamage(player.party[combat.playerQueue], target, spell.stats.amount, "actor");
					stat.checkSuccess(target, spell);
				}
				combat.reduceUltimate(player.party[combat.playerQueue], "actor");
			}
		}
		console.log(combat.playerQueue);
		combat.playerQueue += 1;
		if(combat.playerQueue <= player.party.length){
			displayer.hideOptions();
			if(combat.playerQueue == player.party.length){
				combat.currentTurn = 1;
			}
			combat.initiateTurn();
			$("#targets").hide();
			$("#targetSubmit").hide();
		}
	}
}

class DamageReduction{
	constructor(){}

	calculatePhysicalDamageReduction(defense){
		return defense * 0.0016;
	}

	calculateMagicalDamageReduction(resistance){
		return resistance * 0.0012;
	}
}