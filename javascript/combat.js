//** Combat Class **//

class Combat{
	constructor(currentTurn, playerQueue, gameOver,  fieldEffectTurn, enemyQueue, turnCount){
		this.currentTurn = currentTurn;
		this.playerQueue = playerQueue;
		this.gameOver = gameOver;
		this.fieldEffectTurn = fieldEffectTurn;
		this.enemyQueue = enemyQueue;
		this.turnCount = turnCount;
	}

	initiateFieldTurn(){
		/* types of field effects: damage all, heal all, buff or debuff certain type */
		//Check type of field --> use switch to determine what to run based on field type --> apply effects/deal damage or healing 
	}

	/* Change statusEffects == "DEAD" or != "DEAD" to function check for "DEAD" status object */
	initiateTurn(){
		if(this.currentTurn == 0 && this.gameOver == false){
			var takeTurn = stat.checkStatus(this.playerQueue);
			if(this.checkDeathStatus(player.party[this.playerQueue]) == false && takeTurn != false){
				displayer.displayOptions();
			}else if(this.checkDeathStatus(player.party[this.playerQueue]) == true || takeTurn == false){
				this.playerQueue += 1;
				if(this.playerQueue >= player.party.length){
					console.log("got here");
					log.print("--------- Turn: " + combat.turnCount + " [Enemy's Turn] ---------");
					this.currentTurn = 1;
					this.turnCount += 1;
					this.fieldEffectTurn += 1;
					$("#targets").hide();
					$("#targetSubmit").hide();
					if(combat.fieldEffectTurn < 2){
						this.initiateTurn();
					}else if(combat.fieldEffectTurn = 2){
						console.log("Field Turn Initiated after Player Turn");
						field.initiateFieldTurn();
					}
					
				}else if(this.playerQueue < player.party.length){
					log.print("--------- Turn: " + combat.turnCount + " [Enemy's Turn] ---------");
					this.initiateTurn();
				}
			}
		}else if(this.currentTurn == 1 && this.gameOver == false){
			var comb = setInterval(function(){
				if(combat.enemyQueue<enemyParty.party.length && combat.gameOver == false){
					var takeTurn = stat.checkStatus(combat.enemyQueue);
					if(combat.checkDeathStatus(enemyParty.party[combat.enemyQueue]) == false && takeTurn != false){
						var targ = combat.selectAliveTarget(player.party);
						combat.selectRandomAction(targ);
						combat.enemyQueue += 1;
					}else if(combat.checkDeathStatus(enemyParty.party[combat.enemyQueue]) == true || takeTurn == false){
						log.print("This unit is incapacitated and cannot take their turn.");
						combat.enemyQueue += 1;
					}
				}
				else if(combat.enemyQueue>=enemyParty.party.length && combat.gameOver == false){
					clearInterval(comb);
					setTimeout(function(){
						combat.currentTurn = 0;
						combat.playerQueue = 0;
						combat.enemyQueue = 0;
						combat.turnCount += 1;
						combat.fieldEffectTurn += 1;
						console.log(combat.fieldEffectTurn);
						log.print("--------- Turn: " + combat.turnCount + " [Player's Turn] ---------");
						if(combat.fieldEffectTurn < 2){
						combat.initiateTurn();
						}else if(combat.fieldEffectTurn = 2){
							console.log("Field Turn Initiated after Enemy Turn");
							field.initiateFieldTurn();
						}
					},500)
				}else if(combat.gameOver == true){
					clearInterval(comb);
					setTimeout(function(){
						combat.currentTurn = 0;
						combat.playerQueue = 0;
						combat.enemyQueue = 0;
						combat.turnCount += 1;
						log.print("--------- Turn: " + combat.turnCount + " [Player's Turn] ---------");
						combat.initiateTurn();
					}, 500)
				}
			}, 1200);	
		}else if(this.gameOver == true){
			log.print("Game Over");
		}
	}

	selectAliveTarget(party){
		/* For enemy to select a target that is alive. */
		var ind;
		var foundDead = false;
		var choices = [];

		for(var i = 0;i<party.length;i++){
			foundDead = combat.checkDeathStatus(party[i]);
			if(foundDead == true){
				foundDead = false;
				continue;
			}else if(foundDead == false){
				choices.push(party[i]);
			}
		}

		return choices[dieRoll.roll(choices.length)];
	}

	selectRandomAction(targ){
		var ind = dieRoll.roll(3);
		switch(ind){
			case 0:
				/* attack */
				console.log("Enemy is Attacking");
				combat.dealDamage(enemyParty.party[combat.enemyQueue], targ, "actor");
			break;

			case 1:
				/* ability */
				var caster = enemyParty.party[combat.enemyQueue];
				var casterSpells = enemyParty.party[combat.enemyQueue].abilities;
				if(casterSpells.length > 0 && combat.checkForSpells(caster) == true){
					var spell = combat.selectRandomAbility(targ);
					if(spell.identity.ability_type == "spell"){
						if(spell.identity.target_type == "single" && spell.identity.modify_type == "damage"){
							combat.spellDamage(caster, targ, "actor", spell, spell.identity.ability_type);
							stat.checkSuccess(targ, spell);
							combat.reduceMana(caster, spell, "enemy");
						}else if(spell.identity.target_type == "multi-target" && spell.identity.modify_type == "damage"){
							combat.dealPartyDamage(player.party, spell, spell.identity.ability_type);
							combat.reduceMana(caster, spell, "enemy");
						}else if(spell.identity.target_type == "single" && spell.identity.modify_type == "healing" || spell.identity.target_type == "single" && spell.identity.modify_type == "utility"){
							var target = combat.selectAliveTarget(enemyParty.party);
							log.print("["+ spell.details.name + "]!");
							combat.healDamage(caster, target, spell.stats.amount, "enemy");
							stat.checkSuccess(targ, spell);
							combat.reduceMana(caster, spell, "enemy");
						}else if(spell.identity.target_type == "multi-target" && spell.identity.modify_type == "healing" || spell.identity.target_type == "multi-target" && spell.identity.modify_type == "utility"){
							combat.dealPartyHealing(enemyParty.party, spell, spell.identity.ability_type);
							combat.reduceMana(caster, spell, "enemy");
						}else if(spell.identity.target_type == "self"){
							combat.healDamage(enemyParty.party[combat.enemyQueue], enemyParty.party[combat.enemyQueue], spell.stats.amount, "enemy");
							log.print("["+ spell.details.name + "]!");
							stat.checkSuccess(enemyParty.party[combat.enemyQueue], spell);
							combat.reduceMana(enemyParty.party[combat.enemyQueue], spell, "enemy");
						}
					}else if(spell.identity.ability_type == "special"){
						if(spell.identity.target_type == "single" && spell.identity.modify_type == "damage"){
							combat.spellDamage(caster, targ, "actor", spell, spell.identity.ability_type);
							stat.checkSuccess(targ, spell);
							combat.reduceSp(caster, spell, "enemy");
						}else if(spell.identity.target_type == "multi-target" && spell.identity.modify_type == "damage"){
							combat.dealPartyDamage(player.party, spell, spell.identity.ability_type);
							combat.reduceSp(caster, spell, "enemy");
						}else if(spell.identity.target_type == "single" && spell.identity.modify_type == "healing" || spell.identity.target_type == "single" && spell.identity.modify_type == "utility"){
							var target = combat.selectAliveTarget(enemyParty.party);
							log.print("["+ spell.details.name + "]!");
							combat.healDamage(caster, target, spell.stats.amount, "enemy");
							stat.checkSuccess(targ, spell);
							combat.reduceSp(caster, spell, "enemy");
						}else if(spell.identity.target_type == "multi-target" && spell.identity.modify_type == "healing" || spell.identity.target_type == "multi-target" && spell.identity.modify_type == "utility"){
							combat.dealPartyHealing(enemyParty.party, spell, spell.identity.ability_type);
							combat.reduceSp(caster, spell, "enemy");
						}else if(spell.identity.target_type == "self"){
							combat.healDamage(enemyParty.party[combat.enemyQueue], enemyParty.party[combat.enemyQueue], spell.stats.amount, "enemy");
							log.print("["+ spell.details.name + "]!");
							stat.checkSuccess(enemyParty.party[combat.enemyQueue], spell);
							combat.reduceSp(enemyParty.party[combat.enemyQueue], spell, "enemy");
						}
					}
				}else{
					console.log("Enemy attempted to select a spell but did not have any.");
					combat.selectRandomAction(targ);
				}
			break;

			case 2:
				var caster = enemyParty.party[combat.enemyQueue];
				var casterSpells = enemyParty.party[combat.enemyQueue].abilities;
				if(casterSpells.length > 0 && caster.profile.ultimate == caster.profile.maxUltimate){
					var caster = enemyParty.party[combat.enemyQueue];
					var spell = combat.selectUltimate(targ);
					if(spell.identity.ability_type == "spell" && spell != undefined){
						if(spell.identity.target_type == "single" && spell.identity.modify_type == "damage"){
							combat.spellDamage(caster, targ, "actor", spell, spell.identity.ability_type);
							stat.checkSuccess(targ, spell);
							combat.reduceUltimate(caster, "enemy");
						}else if(spell.identity.target_type == "multi-target" && spell.identity.modify_type == "damage"){
							combat.dealPartyDamage(player.party, spell, spell.identity.ability_type);
							combat.reduceUltimate(caster, "enemy");
						}else if(spell.identity.target_type == "single" && spell.identity.modify_type == "healing" || spell.identity.target_type == "single" && spell.identity.modify_type == "utility"){
							var target = combat.selectAliveTarget(enemyParty.party);
							log.print("["+ spell.details.name + "]!");
							combat.healDamage(caster, target, spell.stats.amount, "enemy");
							stat.checkSuccess(targ, spell);
							combat.reduceUltimate(caster, "enemy");
						}else if(spell.identity.target_type == "multi-target" && spell.identity.modify_type == "healing" || spell.identity.target_type == "multi-target" && spell.identity.modify_type == "utility"){
							combat.dealPartyHealing(enemyParty.party, spell, spell.identity.ability_type);
							combat.reduceUltimate(caster, "enemy");
						}else if(spell.identity.target_type == "self"){
							combat.healDamage(enemyParty.party[combat.enemyQueue], enemyParty.party[combat.enemyQueue], spell.stats.amount, "enemy");
							stat.checkSuccess(enemyParty.party[combat.enemyQueue], spell);
							combat.reduceUltimate(enemyParty.party[combat.enemyQueue], "enemy");
						}
					}else if(spell.identity.ability_type == "special"){
						if(spell.identity.target_type == "single" && spell.identity.modify_type == "damage"){
							combat.spellDamage(caster, targ, "actor", spell, spell.identity.ability_type);
							stat.checkSuccess(targ, spell);
							combat.reduceUltimate(caster, "enemy");
						}else if(spell.identity.target_type == "multi-target" && spell.identity.modify_type == "damage"){
							combat.dealPartyDamage(player.party, spell, spell.identity.ability_type);
							combat.reduceUltimate(caster, targ, spell.stats.amount, "enemy");
						}else if(spell.identity.target_type == "single" && spell.identity.modify_type == "healing" || spell.identity.target_type == "single" && spell.identity.modify_type == "utility"){
							var target = combat.selectAliveTarget(enemyParty.party);
							log.print("["+ spell.details.name + "]!");
							combat.healDamage(caster, target, spell.stats.amount, "enemy");
							stat.checkSuccess(targ, spell);
							combat.reduceUltimate(caster, "enemy");
						}else if(spell.identity.target_type == "multi-target" && spell.identity.modify_type == "healing" || spell.identity.target_type == "multi-target" && spell.identity.modify_type == "utility"){
							combat.dealPartyHealing(enemyParty.party, spell, spell.identity.ability_type);
							combat.reduceUltimate(caster, "enemy");
						}else if(spell.identity.target_type == "self"){
							combat.healDamage(enemyParty.party[combat.enemyQueue], enemyParty.party[combat.enemyQueue], spell.stats.amount, "enemy");
							stat.checkSuccess(enemyParty.party[combat.enemyQueue], spell);
							combat.reduceUltimate(enemyParty.party[combat.enemyQueue], "enemy");
						}
					}else{
						combat.selectRandomAction(targ);
					}
				}else{
					console.log("Enemy tried to cast an ultimate but did not have any ultimates or the energy to cast one.");
					combat.selectRandomAction(targ);
				}

			break;
		}
	}

	selectRandomAbility(targ){
		var caster = enemyParty.party[combat.enemyQueue];
		var casterSpells = enemyParty.party[combat.enemyQueue].abilities;
		

		if(casterSpells.length > 0){
			for(var i = 0;i<casterSpells.length;i++){
				if(casterSpells[i].identity.ability_type == "spell"){
					if(casterSpells[i].stats.mana_cost < caster.profile.mana){
						return casterSpells[i]
					}
				}else if(casterSpells[i].identity.ability_type == "special"){
					if(casterSpells[i].stats.mana_cost < caster.profile.sp){
						return casterSpells[i];
					}
				}
				combat.selectRandomAction(targ);
			}
		}else{
			combat.selectRandomAction(targ);
		}
		
	}

	selectUltimate(targ){
		var caster = enemyParty.party[combat.enemyQueue];
		if(caster.profile.ultimate == caster.profile.maxUltimate){
			for(var i = 0;i<caster.abilities.length;i++){
				if(caster.abilities[i].identity.ultimate == "yes"){
					console.log("reached here");
					return caster.abilities[i];
				}
			}
		}

		combat.selectRandomAction(targ);
	}

	checkForSpells(target){
		var spellFound = false;
		if(target.abilities.length > 0){
			for(var i = 0;i<target.abilities.length;i++){
				if(target.abilities[i].identity.ability_type == "spell" && target.abilities[i].identity.ultimate == "no" || target.abilities[i].identity.ability_type == "special" && target.abilities[i].identity.ultimate == "no"){
					spellFound = true;
					return spellFound;
				}
			}

			return spellFound;
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


	//Checks the element of the defender against the element of the attacker
	//Returns whether "strong" or "weak" and applies damage bonus based on that.
	checkElements(attacker, defender, damage){
		for(key in elemental.chart){
			if(attacker.profile.element == key.element){
				if(defender.profile.element == key.superEffective){
					return db.superStrongTo(damage);
				}else if(defender.profile.element == key.weakness){
					return db.weakTo(damage);
				}
			}
		}

		return damage;
	}

	checkElementsSpell(spell, defender, damage){
		for(key in elemental.chart){
			if(spell.details.element == key.element){
				if(defender.profile.element == key.superEffective){
					return db.superStrongTo(damage);
				}else if(defender.profile.element == key.weakness){
					return db.weakTo(damage);
				}
			}
		}

		return damage;
	}


	dealDamage(attacker, defender, affiliation){
		var damage = Math.floor(attacker.stats.attack - (damageReduction.calculatePhysicalDamageReduction(defender.stats.defense)));
		var attackerAffiliation = combat.currentTurn == 0 ? "actor" : "enemy";
		damage = checkElements(attacker, defender, damage);

		damage = crit.calculateCrit(attacker.stats.crit, damage);
		defender.profile.health -= damage;
		attacker.profile.ultimate += 10;
		combat.maxOutResource(attacker, "ultimate");
		log.print("Attack! " + attacker.profile.name + " dealt " + damage + " to " + defender.profile.name + "!");
		combat.defaultOutResource(defender, "health");

		displayer.updateUltimateBar(attacker, attackerAffiliation);
		displayer.updateHealth(defender, affiliation);
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

		damage = checkElementsSpell(spell, defender, damage);

		defender.profile.health -= damage;
		
		log.print("["+ spell.details.name + "]!" + caster.profile.name + " dealt " + damage + " to " + defender.profile.name + "!");
		combat.defaultOutResource(defender, "health");
		displayer.updateHealth(defender, affiliation);
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
		if(heal_amount == 0){healing = 0;}
		patient.profile.health += healing;
		combat.maxOutResource(patient, "health");

		log.print(healer.profile.name + " restored " + heal_amount + " health to " + patient.profile.name + "!");
		displayer.updateHealth(patient, affiliation);
	}

	itemHealing(item, target, affiliation){
		combat.selectStat(target, item.stats.stat, item.stats.amount, "healing");
		inv.reduceItemQuantity(item);
		log.print(item.details.name + "!" + target.profile.name + " restored " + item.stats.amount + " health by using (a)" + item.details.name + "!");
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

	dealPartyDamage(party, spell, ability_type){
		var affiliation = combat.currentTurn == 0 ? "enemy" : "actor";
		var caster = combat.currentTurn == 0 ? player.party[combat.playerQueue] : enemyParty.party[combat.enemyQueue];

		for(var i = 0;i<party.length;i++){
			if(combat.checkDeathStatus(party[i]) != true){
				log.print("["+ spell.details.name + "]!");
				combat.spellDamage(caster, party[i], affiliation, spell, ability_type);
				stat.checkSuccess(party[i], spell);
			}else{
				continue;
			}
		}
	}

	dealPartyHealing(party, spell, ability_type){
		var affiliation = combat.currentTurn == 0 ? "actor" : "enemy";
		var caster = affiliation == "actor" ? player.party[combat.playerQueue] : enemyParty.party[combat.enemyQueue];

		for(var i = 0;i<party.length;i++){
			if(combat.checkDeathStatus(party[i]) != true){
				log.print("["+ spell.details.name + "]!");
				combat.healDamage(caster, party[i], spell.stats.amount, affiliation);
				stat.checkSuccess(party[i], spell);
			}else{
				continue;
			}
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
					if(spell.identity.target_type == "single"){
						combat.spellDamage(player.party[combat.playerQueue], target, "enemy", spell, "spell");
						stat.checkSuccess(target, spell);
					}else if(spell.identity.target_type == "multi-target"){
						combat.dealPartyDamage(target, spell, spell.identity.ability_type);
					}else if(spell.identity.target_type == "self"){
						var affiliation = combat.currentTurn == 0 ? "actor" : "enemy";
						combat.spellDamage(target, target, affiliation, spell, "spell");
						stat.checkSuccess(target, spell);
					}
				}else if(spell.identity.modify_type == "healing" || spell.identity.modify_type == "utility"){
					if(spell.identity.target_type == "single"){
						log.print("["+ spell.details.name + "]!");
						combat.healDamage(player.party[combat.playerQueue], target, spell.stats.amount, "actor");
						stat.checkSuccess(target, spell);	
					}else if(spell.identity.target_type == "multi-target"){
						combat.dealPartyHealing(target, spell, spell.identity.ability_type);
					}else if(spell.identity.target_type == "self"){
						var affiliation = combat.currentTurn == 0 ? "actor" : "enemy";
						log.print(spell.details.name + "!");
						combat.healDamage(target, target, spell.stats.amount, affiliation);
						stat.checkSuccess(target, spell);
					}
				}else if(spell.identity.modify_type == "utility"){
					if(spell.identity.target_type == "single"){
						combat.applyUtility(spell, target);
					}else if(spell.identity.target_type == "multi-target"){
						combat.applyPartyUtility(spell, target);
					}
				}
				combat.reduceMana(player.party[combat.playerQueue], spell, "actor");
			}else if(spell.identity.ability_type == "special"){
				if(spell.identity.modify_type == "damage"){
					if(spell.identity.target_type == "single"){
						combat.spellDamage(player.party[combat.playerQueue], target, "enemy", spell, "special");
						stat.checkSuccess(target, spell);
					}else if(spell.identity.target_type == "multi-target"){
						combat.dealPartyDamage(target, spell, spell.identity.ability_type);
					}else if(spell.identity.target_type == "self"){
						var affiliation = combat.currentTurn == 0 ? "actor" : "enemy";
						combat.spellDamage(target, target, affiliation, spell, "special");
						stat.checkSuccess(target, spell);
					}
				}else if(spell.identity.modify_type == "healing" || spell.identity.modify_type == "utility"){
					if(spell.identity.target_type == "single"){
						log.print("["+ spell.details.name + "]!");
						combat.healDamage(player.party[combat.playerQueue], target, spell.stats.amount, "actor");
						stat.checkSuccess(target, spell);	
					}else if(spell.identity.target_type == "multi-target"){
						combat.dealPartyHealing(target, spell, spell.identity.ability_type);
					}else if(spell.identity.target_type == "self"){
						var affiliation = combat.currentTurn == 0 ? "actor" : "enemy";
						log.print("["+ spell.details.name + "]!");
						combat.healDamage(target, target, spell.stats.amount, affiliation);
						stat.checkSuccess(target, spell);
					}
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
					if(spell.identity.target_type == "single"){
						combat.spellDamage(player.party[combat.playerQueue], target, "enemy", spell, "spell");
						stat.checkSuccess(target, spell);
					}else if(spell.identity.target_type == "multi-target"){
						combat.dealPartyDamage(target, spell, spell.identity.ability_type);
					}else if(spell.identity.target_type == "self"){
						var affiliation = combat.currentTurn == 0 ? "actor" : "enemy";
						combat.spellDamage(target, target, affiliation, spell, "spell");
						stat.checkSuccess(target, spell);
					}
				}else if(spell.identity.modify_type == "healing" || spell.identity.modify_type == "utility"){
					if(spell.identity.target_type == "single"){
						log.print("["+ spell.details.name + "]!");
						combat.healDamage(player.party[combat.playerQueue], target, spell.stats.amount, "actor");
						stat.checkSuccess(target, spell);	
					}else if(spell.identity.target_type == "multi-target"){
						combat.dealPartyHealing(target, spell, spell.identity.ability_type);
					}else if(spell.identity.target_type == "self"){
						var affiliation = combat.currentTurn == 0 ? "actor" : "enemy";
						log.print(spell.details.name + "!");
						combat.healDamage(target, target, spell.stats.amount, affiliation);
						stat.checkSuccess(target, spell);
					}
					
				}
				combat.reduceUltimate(player.party[combat.playerQueue], "actor");
			}else if(spell.identity.ability_type == "special"){
				if(spell.identity.modify_type == "damage"){
					if(spell.identity.target_type == "single"){
						combat.spellDamage(player.party[combat.playerQueue], target, "enemy", spell, "special");
						stat.checkSuccess(target, spell);
					}else if(spell.identity.target_type == "multi-target"){
						combat.dealPartyDamage(target, spell, spell.identity.ability_type);
					}else if(spell.identity.target_type == "self"){
						var affiliation = combat.currentTurn == 0 ? "actor" : "enemy";
						combat.spellDamage(target, target, affiliation, spell, "special");
						stat.checkSuccess(target, spell);
					}
				}else if(spell.identity.modify_type == "healing"){
					if(spell.identity.target_type == "single"){
						log.print("["+ spell.details.name + "]!");
						combat.healDamage(player.party[combat.playerQueue], target, spell.stats.amount, "actor");
						stat.checkSuccess(target, spell);	
					}else if(spell.identity.target_type == "multi-target"){
						combat.dealPartyHealing(target, spell, spell.identity.ability_type);
					}else if(spell.identity.target_type == "self"){
						var affiliation = combat.currentTurn == 0 ? "actor" : "enemy";
						log.print("["+ spell.details.name + "]!");
						combat.healDamage(target, target, spell.stats.amount, affiliation);
						stat.checkSuccess(target, spell);
					}
				}
				combat.reduceUltimate(player.party[combat.playerQueue], "actor");
			}
		}
		combat.playerQueue += 1;
		if(combat.playerQueue <= player.party.length){
			displayer.hideOptions();
			if(combat.playerQueue == player.party.length){
				
				combat.currentTurn = 1;
				combat.turnCount += 1;
				combat.fieldEffectTurn += 1;
				log.print("--------- Turn: " + combat.turnCount + " [Enemy's Turn] ---------");
				console.log(combat.fieldEffectTurn);
				if(combat.fieldEffectTurn == 2){
					combat.iniitiateFieldTurn();
					$("#targets").hide();
					$("#targetSubmit").hide();
				}
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