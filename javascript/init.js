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
enemyParty.party.push(new Actor("Red Dragon", "img/Red_Dragon.png"));
enemyParty.party.push(new Actor("Renamon", "img/renamon.jpg"));
enemyParty.party.push(new Actor("Raven", "img/raven.jpg"));

var shuriken_jutsu = new Ability("Shuriken Jutsu", "A barrage of Shuriken are launched at lightning fast speed to deal damage.", 1, "damage", "single", "special", 10, 100, 0.05, "NA", 0.10);
var fireball = new Ability("Fireball", "Launch a Fireball at a single target dealing magic damage.", 1, "damage", "single", "spell", 10, 75, 0.05, 
	new StatusEffect("Burn", "This unit takes ticking burn damage each turn.", "OverTime", "dot", 3, 10, "NONE"), 1.00);
var holy_light = new Ability("Holy Light", "Bless the target with holy light, healing minor wounds.", 1, "healing", "single", "spell", 20, 50, 0.05, "NA", 0);
var shatter = new Ability("Shatter", "Use Holy Light to incapacitate an enemy for 2 turns.", 1, "damage", "single", "special", 15, 45, 0.05, new StatusEffect("Stun", "This unit is incapacitated and cannot act.", "Incapacitate", "NONE", 2, 0, "NONE"), 1.00);
var daze_palm = new Ability("Daze Palm", "Strike the target with a palm force hard enough to disorient them.", 1, "damage", "single", "special", 25, 60, 0.05, new StatusEffect("Dazed", "This unit is in a disoriented state, making their actions unpredictable and random.", "Disorient", "NONE", 2, 0, "NONE"), 1.00);
var poisonous_cupcake = new Ability("Poisonous Cupcake", "Force-feed a poisonous cupcake to an opponent and poison them.", 1, "damage", "single", "special", 20, 50, 0.05, new StatusEffect("Food Poisoning", "This unit is ill from food poisoning and taking damage every turn.", "OverTime", "damage", 3, 20, "NONE"), 1.00);
var restorative_foodpill = new Ability("Restorative Foodpill", "Give a rejuvanating foodpill to an ally, restoring health for 3 turns.", 1, "healing", "single", "special", 40, 25, 0.05, new StatusEffect("Rejuvanation", "Restoring Health each turn.", "OverTime", "hot", 3, 25, "NONE"), 1.00);
player.party.push(new Hero("Itachi", "img/itachi.png", 0, 30, 200, 200, 150, 150, 150, 150, 1, 10, 70, 10, 70, []));
player.party.push(new Hero("Karin", "img/karin.jpg", 0, 30, 200, 200, 150, 150, 150, 150, 1, 10, 70, 10, 70, []));
player.party.push(new Hero("Hinata", "img/hinata.jpg", 0, 30, 200, 200, 150, 150, 150, 150, 1, 10, 70, 10, 70, []));
player.party.push(new Hero("Pinkamena", "img/pinkie.png", 0, 30, 200, 200, 150, 150, 150, 150, 1, 10, 70, 10, 70, []));
player.party[0].abilities.push(fireball);
player.party[0].abilities.push(shuriken_jutsu);
player.party[1].abilities.push(holy_light);
player.party[1].abilities.push(shatter);
player.party[2].abilities.push(daze_palm);
player.party[3].abilities.push(poisonous_cupcake);
player.party[3].abilities.push(restorative_foodpill);


var stat = new StatusController();
$(document).ready(function(){
	displayer.displayParty(player.party, "actor");
	displayer.displayParty(enemyParty.party,"enemy");
	combat.initiateTurn();

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






