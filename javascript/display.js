//** Display Class **//

class Display{
	constructor(){};


	displayParty(team, owner){
		for(var i = 1;i<=team.length;i++){
			$('div#' + owner + '_'+ i +' img.actor_card_img').attr('src', team[(i-1)].profile.img);
		}
	}

	displayTargetSelection(team, action_type, spell = []){
		$(".options_container").html("");
		$(".options_container").html('<select id="targets"></select>');
		for(var i = 0;i<team.length;i++){
			if(team[i].statusEffects != "DEAD"){
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

	displayAbilitySelection(actor){
		$(".options_container").html("");
		$(".options_container").html('<select id="abilities"></select>');
		for(var i = 0;i<actor.abilities.length;i++){
			$("#abilities").append("<option value='"+i+"'>"+ actor.abilities[i].details.name +"</option>");
		}
		$(".options_container").append("<button id='targetSelect'>Cast</button>")
		$(".options_container").append("<br/><button id='back_btn'>Back</button>");

		$("#back_btn").click(function(){
			displayer.displayOptions();
		});

		$("#targetSelect").click(function(){
			var spell = actor.abilities[$("#abilities").prop("value")];
			if(actor.profile.mana >= spell.stats.mana_cost){
				if(spell.identity.modify_type == "healing" || spell.identity.modify_type == "utility"){
					displayer.displayTargetSelection(player.party, "ability", spell);
				}else if(spell.identity.modify_type == "damage"){
					displayer.displayTargetSelection(enemyParty.party, "ability", spell);
				}
			}else{
				log.print(actor.profile.name + " does not have enough mana to to cast that spell!");
			}
		});
	}

	displayOptions(){
		$(".options_container").html("");
		$(".options_container").append("<button id='attack'>Attack</button><br/>");
		$(".options_container").append("<button id='ability'>Abilities</button><br/>");

		$("#attack").click(function(){
			actions.attack();
		});

		$("#ability").click(function(){
			actions.ability();
		})
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
}