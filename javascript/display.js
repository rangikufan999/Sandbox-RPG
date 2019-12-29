//** Display Class **//

class Display{
	constructor(){};


	displayParty(team, owner){
		for(var i = 1;i<=team.length;i++){
			$('div#' + owner + '_'+ i +' img.actor_card_img').attr('src', team[(i-1)].profile.img);
		}
	}

	displayTargetSelection(team, action_type, spell){
		$(".options_container").html("");
		$(".options_container").html('<select id="targets"></select>');
		for(var i = 0;i<team.length;i++){
			if(combat.checkDeathStatus(team[i]) == false){
				$("#targets").append("<option value='"+i+"'>"+ team[i].profile.name +" ["+i+"]");
			}
		}
		$(".options_container").append("<button id='targetSubmit'>Select Target</button>");
		$(".options_container").append("<br/><button id='back_btn'>Back</button>");

		$("#back_btn").click(function(){
			displayer.displayOptions();
		});

		$("#targetSubmit").click(function(){
			actions.determineTarget(team[$("#targets").prop("value")], action_type, spell);
			if(combat.playerQueue == player.party.length){
				displayer.hideOptions();
			}else{
				displayer.displayOptions();
			}
		});
	}

	displayAbilitySelection(actor, ult){
		$(".options_container").html("");
		$(".options_container").html('<select id="abilities"></select>');
		for(var i = 0;i<actor.abilities.length;i++){
			if(ult == "non-ult"){
				if(actor.abilities[i].identity.ultimate == "no"){
					$("#abilities").append("<option value='"+i+"'>"+ actor.abilities[i].details.name +"</option>");
				}
			}else if(ult == "ult"){
				if(actor.abilities[i].identity.ultimate == "yes"){
					$("#abilities").append("<option value='"+i+"'>"+ actor.abilities[i].details.name +"</option>");
				}
			}
		}
		$(".options_container").append("<button id='targetSelect'>Cast</button>");
		$(".options_container").append("<br/><button id='back_btn'>Back</button>");

		$("#back_btn").click(function(){
			displayer.displayOptions();
		});

		$("#targetSelect").click(function(){
			var spell = actor.abilities[$("#abilities").prop("value")];
			if(ult == "non-ult"){
				if(spell.identity.ability_type == "spell"){
					if(actor.profile.mana >= spell.stats.mana_cost){
						if(spell.identity.modify_type == "healing" || spell.identity.modify_type == "utility"){
							if(spell.identity.target_type == "single"){
								displayer.displayTargetSelection(player.party, "ability", spell);
							}else if(spell.identity.target_type == "multi-target"){
								actions.determineTarget(player.party, "ability", spell);
							}else if(spell.identity.target_type == "self"){
								actions.determineTarget(actor, "ability", spell);
							}
						}else if(spell.identity.modify_type == "damage"){
							if(spell.identity.target_type == "single"){
								displayer.displayTargetSelection(enemyParty.party, "ability", spell);
							}else if(spell.identity.target_type == "multi-target"){
								actions.determineTarget(enemyParty.party, "ability", spell);
							}else if(spell.identity.target_type == "self"){
								actions.determineTarget(actor, "ability", spell);
							}
						}
					}else{
						log.print(actor.profile.name + " does not have enough mana to to cast that spell!");
					}
				}else if(spell.identity.ability_type == "special"){
					if(actor.profile.sp >= spell.stats.mana_cost){
						if(spell.identity.modify_type == "healing" || spell.identity.modify_type == "utility"){
							if(spell.identity.target_type == "single"){
								displayer.displayTargetSelection(player.party, "ability", spell);
							}else if(spell.identity.target_type == "multi-target"){
								actions.determineTarget(player.party, "ability", spell);
							}else if(spell.identity.target_type == "self"){
								actions.determineTarget(actor, "ability", spell);
							}
						}else if(spell.identity.modify_type == "damage"){
							if(spell.identity.target_type == "single"){
								displayer.displayTargetSelection(enemyParty.party, "ability", spell);
							}else if(spell.identity.target_type == "multi-target"){
								actions.determineTarget(enemyParty.party, "ability", spell);
							}else if(spell.identity.target_type == "self"){
								actions.determineTarget(actor, "ability", spell);
							}
						}
					}else{
						log.print(actor.profile.name + " does not have enough sp to to cast that spell!");
					}
				}
			}else if(ult == "ult"){
				if(spell.identity.ability_type == "spell"){
					if(spell.identity.modify_type == "healing" || spell.identity.modify_type == "utility"){
						if(spell.identity.target_type == "single"){
							displayer.displayTargetSelection(player.party, "ultimate", spell);
						}else if(spell.identity.target_type == "multi-target"){
							actions.determineTarget(player.party, "ultimate", spell);
						}else if(spell.identity.target_type == "self"){
							actions.determineTarget(actor, "ultimate", spell);
						}
					}else if(spell.identity.modify_type == "damage"){
						if(spell.identity.target_type == "single"){
							displayer.displayTargetSelection(enemyParty.party, "ultimate", spell);
						}else if(spell.identity.target_type == "multi-target"){
							actions.determineTarget(enemyParty.party, "ultimate", spell);
						}else if(spell.identity.target_type == "self"){
							actions.determineTarget(actor, "ultimate", spell);
						}
					}
				}else if(spell.identity.ability_type == "special"){
					if(spell.identity.modify_type == "healing" || spell.identity.modify_type == "utility"){
						if(spell.identity.target_type == "single"){
							displayer.displayTargetSelection(player.party, "ultimate", spell);
						}else if(spell.identity.target_type == "multi-target"){
							actions.determineTarget(player.party, "ultimate", spell);
						}else if(spell.identity.target_type == "self"){
							actions.determineTarget(actor, "ultimate", spell);
						}
					}else if(spell.identity.modify_type == "damage"){
						if(spell.identity.target_type == "single"){
							displayer.displayTargetSelection(enemyParty.party, "ultimate", spell);
						}else if(spell.identity.target_type == "multi-target"){
							actions.determineTarget(enemyParty.party, "ultimate", spell);
						}else if(spell.identity.target_type == "self"){
							actions.determineTarget(actor, "ultimate", spell);
						}
					}
				}
			}
		});
	}

	

	displayItemsSelection(inventory){
		$(".options_container").html("");
		$(".options_container").html("<select id='items'></select>");
		if(inventory.length > 0){
			for(var i = 0;i<inventory.length;i++){
				$("#items").append("<option value='"+i+"'>" + inventory[i].details.name + "</option>");
			}
		}else if(inventory.length <= 0){
			log.print("No Items to use!");
		}
		$(".options_container").append("<button id='targetSelect'>Use</button>");
		$(".options_container").append("<br/><button id='back_btn'>Back</button>");

		$("#back_btn").click(function(){
			displayer.displayOptions();
		});

		$("#targetSelect").click(function(){
			var item = inventory[$("#items").prop("value")];
			if(item.identity.modify_type == "damage" || item.identity.modify_type == "utility_enemy"){
				displayer.displayTargetSelection(enemyParty.party, "item", item);
			}else if(item.identity.modify_type == "healing" || item.identity.modify_type == "utility_ally"){
				displayer.displayTargetSelection(player.party, "item", item);
			}
		});
	}

	displayOptions(){
		$(".options_container").html("");
		$(".options_container").append("<button id='attack'>Attack</button><br/>");
		$(".options_container").append("<button id='ability'>Abilities</button><br/>");
		$(".options_container").append("<button id='items'>Items</button><br/>");
		$(".options_container").append("<button id='ultimate'>Ultimate</button><br/>");

		$(".options_container").prepend("<div class='actor_info'>" + player.party[combat.playerQueue].profile.name + " is up now!</div>");

		$("#attack").click(function(){
			actions.attack();
		});

		$("#ability").click(function(){
			actions.ability();
		});

		$("#items").click(function(){
			actions.items();
		});

		$("#ultimate").click(function(){
			if(player.party[combat.playerQueue].profile.ultimate >= player.party[combat.playerQueue].profile.maxUltimate){
				actions.ultimate();
			}else{
				log.print("You do not have enough ultimate points to use an Ultimate!");
			}
		});
	}

	hideOptions(){
		$(".options_container").html("");
	}

	updateHealth(target, affiliation){
		var index;
		var a = target.profile.health * (100 / target.profile.maxHealth);
		if(a < 0){
			a = 0;
		}
		if(affiliation == "actor"){
			index = player.party.indexOf(target) + 1;
		}else if(affiliation == "enemy"){
			index = enemyParty.party.indexOf(target) + 1;
		}
		$("div#" + affiliation + "_"+index+"  div.health-bar-text").html(Math.round(a) + "%");
		$("div#" + affiliation + "_"+index+"  div.health-bar-red").animate({'width':a + '%'}, 700);
		$("div#" + affiliation + "_"+index+"  div.health-bar").animate({'width': a + '%'}, 500);
		$("div#" + affiliation + "_"+index+"  div.health-bar-blue").animate({'width': a + '%'}, 300);
	}

	updateMana(target, affiliation){
		var index;
		var a = target.profile.mana * (100 / target.profile.maxMana);
		if(a < 0){
			a = 0;
		}
		if(affiliation == "actor"){
			index = player.party.indexOf(target) + 1;
		}else if(affiliation == "enemy"){
			index = enemyParty.party.indexOf(target) + 1;
		}

		$("div#" + affiliation + "_"+index+" div.mana-bar-text").html(Math.round(a) + "%");
		$("div#" + affiliation + "_"+index+" div.mana-bar-red").animate({'width':a + '%'}, 700);
		$("div#" + affiliation + "_"+index+" div.mana-bar").animate({'width':a + '%'}, 500);
		$("div#" + affiliation + "_"+index+" div.mana-bar-blue").animate({'width':a + '%'}, 300);
	}

	updateSp(target, affiliation){
		var index;
		var a = target.profile.sp * (100 / target.profile.maxSp);
		if(a < 0){
			a = 0;
		}
		if(affiliation == "actor"){
			index = player.party.indexOf(target) + 1;
		}else if(affiliation == "enemy"){
			index = enemyParty.party.indexOf(target) + 1;
		}

		$("div#" + affiliation + "_"+index+" div.sp-bar-text").html(Math.round(a) + "%");
		$("div#" + affiliation + "_"+index+" div.sp-bar-red").animate({'width':a + '%'}, 700);
		$("div#" + affiliation + "_"+index+" div.sp-bar").animate({'width':a + '%'}, 500);
		$("div#" + affiliation + "_"+index+" div.sp-bar-blue").animate({'width':a + '%'}, 300);
	}

	updateUltimateBar(target, affiliation){
		var index;
		var a = target.profile.ultimate * (100 / target.profile.maxUltimate);
		if(a < 0){
			a = 0;
		}
		if(affiliation == "actor"){
			index = player.party.indexOf(target) + 1;
		}else if(affiliation == "enemy"){
			index = enemyParty.party.indexOf(target) + 1;
		}

		$("div#" + affiliation + "_"+index+" div.ult-bar-text").html(Math.round(a) + "%");
		$("div#" + affiliation + "_"+index+" div.ult-bar-red").animate({'width':a + '%'}, 700);
		$("div#" + affiliation + "_"+index+" div.ult-bar").animate({'width':a + '%'}, 500);
		$("div#" + affiliation + "_"+index+" div.ult-bar-blue").animate({'width':a + '%'}, 300);
	}

	massUpdateScreen(){
		for(var i = 0;i<player.party.length;i++){
			displayer.updateHealth(player.party[i], "actor");
			displayer.updateMana(player.party[i], "actor");
			displayer.updateSp(player.party[i], "actor");
			displayer.updateUltimateBar(player.party[i], "actor");
		}

		for(var i = 0;i<enemyParty.party.length;i++){
			displayer.updateHealth(enemyParty.party[i], "enemy");
			displayer.updateMana(enemyParty.party[i], "enemy");
			displayer.updateSp(enemyParty.party[i], "enemy");
			displayer.updateUltimateBar(enemyParty.party[i], "enemy");
		}
	}
}