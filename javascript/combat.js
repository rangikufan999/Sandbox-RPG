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
			if(player.party[this.playerQueue].statusEffects != "DEAD"){
				displayer.displayOptions();
			}else if(player.party[this.playerQueue].statusEffects == "DEAD"){
				this.playerQueue += 1;
				if(this.playerQueue >= player.party.length){
					this.currentTurn = 1;
					this.initiateTurn();
					$("#targets").hide();
					$("#targetSubmit").hide();
				}
			}
		}else if(this.currentTurn == 1 && this.gameOver == false){
			log.print("Enemy's Turn! Here they come!");
			var i = 0;
			var comb = setInterval(function(){
				if(i<enemyParty.party.length && combat.gameOver == false){
					if(enemyParty.party[i].statusEffects != "DEAD"){
						log.print("Enemy #" + i + " has attacked!");
						combat.dealDamage(enemyParty.party[i], player.party[dieRoll.roll(player.party.length)], "actor");
						i += 1;
					}else if(enemyParty.party[i].statusEffects == "DEAD"){
						log.print("Enemy #" + i + " is incapacitated!");
						i += 1;
					}
				}
				else if(i>=enemyParty.party.length && combat.gameOver == false){
					clearInterval(comb);
					setTimeout(function(){
						combat.currentTurn = 0;
						combat.playerQueue = 0;
						combat.initiateTurn();
					},1500)
				}else if(combat.gameOver == true){
					clearInterval(comb);
					setTimeout(function(){
						combat.currentTurn = 0;
						combat.playerQueue = 0;
						combat.initiateTurn();
					}, 500)
				}
			}, 1500);	
		}else if(this.gameOver == true){
			log.print("Game Over");
		}
	}

	dealDamage(attacker, defender, affiliation){
		var damage = Math.floor(attacker.stats.attack - (damageReduction.calculatePhysicalDamageReduction(defender.stats.defense)));
		defender.profile.health -= damage;
		
		
		log.print(damage + " damage was dealt!");
		if(defender.profile.health < 0){
			defender.profile.health = 0;
			defender.statusEffects = "DEAD";
		}
		displayer.updateHealth(defender, affiliation)
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
		
		log.print(damage + " damage was dealt!");
		if(defender.profile.health < 0){
			defender.profile.health = 0;
			defender.statusEffects = "DEAD";
		}
		displayer.updateHealth(defender, affiliation)
		combat.checkGameOver(player,enemyParty);
	}

	healDamage(healer, patient, heal_amount, affiliation){
		var healing = Math.floor(healer.stats.magic + heal_amount);
		patient.profile.health += healing;
		if(patient.profile.health > patient.profile.maxHealth){
			patient.profile.health = patient.profile.maxHealth;
		}

		log.print(healer.profile.name + " restored " + heal_amount + " health to " + patient.profile.name + "!");
		displayer.updateHealth(patient, affiliation)
	}

	reduceMana(caster, spell, affiliation){
		caster.profile.mana -= spell.stats.mana_cost;
		if(caster.profile.mana < 0){caster.profile.mana = 0;}
		displayer.updateMana(caster, affiliation);
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
}

class Actions{
	constructor(){};

	attack(){
		displayer.displayTargetSelection(enemyParty.party, "attack");	
	}

	ability(){
		displayer.displayAbilitySelection(player.party[combat.playerQueue]);
	}

	determineTarget(target, action_type, spell = []){
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
			}


		}
		combat.playerQueue += 1;
		if(combat.playerQueue >= player.party.length){
			combat.currentTurn = 1;
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