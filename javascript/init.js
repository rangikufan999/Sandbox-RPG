//** INITIALIZATION **//
var player = new Player("rangikufan999");
var enemyParty = new EnemyParty();
var displayer = new Display();
var combat = new Combat(0, 0, false);
var actions = new Actions();
var log = new Log();
var dieRoll = new DieRoll();
var damageReduction = new DamageReduction();




enemyParty.party.push(new Actor("Bowsette", "img/bowsette.jpg"));
enemyParty.party.push(new Actor("Bowsette", "img/bowsette.jpg"));
enemyParty.party.push(new Actor("Bowsette", "img/bowsette.jpg"));
var shuriken_jutsu = new Ability("Shuriken Jutsu", "A barrage of Shuriken are launched at lightning fast speed to deal damage.", 1, "damage", "single", "special", 10, 100, 0.05, "NA", 0.10);
var fireball = new Ability("Fireball", "Launch a Fireball at a single target dealing magic damage.", 1, "damage", "single", "spell", 10, 75, 0.05, 
	new StatusEffect("Burn", "This unit takes ticking burn damage each turn.", "OverTime", 3, 10, "NONE"), 0.10);
var holy_light = new Ability("Holy Light", "Bless the target with holy light, healing minor wounds.", 1, "healing", "single", "spell", 20, 50, 0.05, "NA", 0);
player.party.push(new Hero("Itachi", "img/itachi.png", 0, 30, 200, 200, 150, 150, 1, 10, 40, 10, 30, []));
player.party.push(new Hero("Karin", "img/karin.jpg", 0, 30, 200, 200, 150, 150, 1, 10, 40, 10, 30, []));
player.party[0].abilities.push(fireball);
player.party[1].abilities.push(holy_light);
player.party[0].abilities.push(shuriken_jutsu);

var stat = new StatusController();
$(document).ready(function(){
	displayer.displayParty(player.party, "actor");
	displayer.displayParty(enemyParty.party,"enemy");

	$("#attack").click(function(){
		actions.attack();
	});

	$("#ability").click(function(){
		actions.ability();
	});
});



/* Tooltip for Status Effects Code */
// var p = "<h1>"
// for(var i = 0;i<player.party[0].status.statusEffects.length;i++){
// 	p += "1. " + player.party[0].status.statusEffects[i].details.name + "<br/>";
// }
// p += "</h1>";

// tippy('#actor_one', {
// 	content: p
// });






