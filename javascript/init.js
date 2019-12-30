//** INITIALIZATION **//
var player = new Player("rangikufan999");
var enemyParty = new EnemyParty();
var displayer = new Display();
var combat = new Combat(0, 0, false, 0, 0);
var actions = new Actions();
var log = new Log();
var dieRoll = new DieRoll();
var damageReduction = new DamageReduction();
var inv = new Inventory();
var crit = new Crit();
var db = new DamageBonus();




enemyParty.party.push(new Actor("Bowsette", "img/bowsette.jpg"));
enemyParty.party.push(new Actor("Bowsette", "img/bowsette.jpg"));
enemyParty.party.push(new Actor("Red Dragon", "img/Red_Dragon.png"));
enemyParty.party.push(new Actor("Renamon", "img/renamon.jpg"));
enemyParty.party.push(new Actor("Raven", "img/raven.jpg"));

var shuriken_jutsu = new Ability("Shuriken Jutsu", "A barrage of Shuriken are launched at lightning fast speed to deal damage.", 1, "damage", "single", "special", "no", 10, 100, 0.05, "NA", 0.10);
var fireball = new Ability("Fireball", "Launch a Fireball at a single target dealing magic damage.", 1, "damage", "single", "spell", "no", 10, 75, 0.05, 
	new StatusEffect("Burn", "This unit takes ticking burn damage each turn.", "OverTime", "dot", 3, 10, "NONE"), 1.00);
var phoenix_fire = new Ability("Phoenix Fire", "Launch a five count Phoenix Fire jutsu at the enemy.", 1, "damage", "multi-target", "spell", "no", 20, 150, 0.05, new StatusEffect("Burn", "This unit takes ticking burn damage each turn.", "OverTime", "dot", 3, 15, "NONE"), 1.00);
var holy_light = new Ability("Holy Light", "Bless the target with holy light, healing minor wounds.", 1, "healing", "single", "spell", "no", 20, 50, 0.05, "NA", 0);
var shatter = new Ability("Shatter", "Use Holy Light to incapacitate an enemy for 2 turns.", 1, "damage", "single", "special", "no", 15, 45, 0.05, new StatusEffect("Stun", "This unit is incapacitated and cannot act.", "Incapacitate", "NONE", 2, 0, "NONE"), 1.00);
var sage_mode = new Ability("Sage Mode", "Activate Phoenix Sage Mode, boosting attack damage.", 1, "utility", "self", "special", "no", 40, 0, 0, new StatusEffect("Sage Mode", "This unit has extra strength", "Buff", "buff", 0, 50, "attack"), 1.00)
var daze_palm = new Ability("Daze Palm", "Strike the target with a palm force hard enough to disorient them.", 1, "damage", "single", "special", "no", 25, 60, 0.05, new StatusEffect("Dazed", "This unit is in a disoriented state, making their actions unpredictable and random.", "Disorient", "NONE", 2, 0, "NONE"), 1.00);
var poisonous_cupcake = new Ability("Poisonous Cupcake", "Force-feed a poisonous cupcake to an opponent and poison them.", 1, "damage", "single", "special", "no", 20, 50, 0.05, new StatusEffect("Food Poisoning", "This unit is ill from food poisoning and taking damage every turn.", "OverTime", "dot", 3, 20, "NONE"), 1.00);
var restorative_foodpill = new Ability("Restorative Foodpill", "Give a rejuvanating foodpill to an ally, restoring health for 3 turns.", 1, "healing", "single", "special", "no", 40, 25, 0.05, new StatusEffect("Rejuvanation", "Restoring Health each turn.", "OverTime", "hot", 3, 25, "NONE"), 1.00);
var cha_nara = new Ability("Chaa-naraa!", "Sakura's inner spirit bolsters her next attack causing high physical damage.", 1, "damage", "single", "special", "no", 20, 200, 0.20, "NA", 0);
var holy_3 = new Ability("Holy III", "Heal all allies for an immense amount of healing.", 1, "healing", "multi-target", "spell", "no", 50, 300, 0.50, "NA", 0);
var firaga = new Ability("Firaga", "Blast all enemies with huge fire damage", 1, "damage", "multi-target", "spell", "no", 50, 300, 0.50, "NA", 0);
var first_aid = new Ability("First Aid", "Apply first aid to all party members.", 1, "healing", "multi-target", "special", "no", 35, 200, 0.50, "NA", 0);

var mangekyou_sharingan = new Ability("Mangekyou Sharingan", "Ultimate Ability of Itachi.", 1, "damage", "single", "special", "yes", 0, 250, 0.05, new StatusEffect("Genjutsu", "This unit is under a genjutsu", "Incapacitate", "NONE", 3, 0, "NONE"), 0.90);


player.party.push(new Hero("Itachi", "img/itachi.png", 0, 30, 600, 600, 150, 150, 150, 150, 0, 10, 1, "Fire", "Human", "Warrior", 10, 70, 10, 70, 1.0, []));
player.party.push(new Hero("Karin", "img/karin.jpg", 0, 30, 600, 600, 150, 150, 150, 150, 0, 10, 1, "Wind", "Human", "Warrior", 10, 70, 10, 70, 1.0, []));
player.party.push(new Hero("Hinata", "img/hinata.jpg", 0, 30, 600, 600, 150, 150, 150, 150, 0, 10, 1, "Wind", "Human", "Warrior", 10, 70, 10, 70, 1.0, []));
player.party.push(new Hero("Pinkamena", "img/pinkie.png", 0, 30, 600, 600, 150, 150, 150, 150, 0, 10, 1, "Earth", "Pony", "Warrior", 10, 70, 10, 70, 1.0, []));
player.party.push(new Hero("Sakura", "img/sage_sakura.png", 0, 30, 600, 600, 150, 150, 150, 150, 0, 10, 1, "Earth", "Human", "Ninja", 10, 70, 10, 70, 1.0, []));

player.party[0].abilities.push(fireball);
player.party[0].abilities.push(shuriken_jutsu);
player.party[0].abilities.push(mangekyou_sharingan);
player.party[0].abilities.push(phoenix_fire);
player.party[1].abilities.push(holy_light);
player.party[1].abilities.push(shatter);
player.party[1].abilities.push(sage_mode);
player.party[2].abilities.push(daze_palm);
player.party[3].abilities.push(poisonous_cupcake);
player.party[3].abilities.push(restorative_foodpill);
player.party[4].abilities.push(cha_nara);

enemyParty.party[0].abilities.push(mangekyou_sharingan);
enemyParty.party[1].abilities.push(mangekyou_sharingan);
enemyParty.party[2].abilities.push(mangekyou_sharingan);
enemyParty.party[3].abilities.push(mangekyou_sharingan);
enemyParty.party[4].abilities.push(mangekyou_sharingan);



//Add Items to inventory here!
var potion = new Item("Potion", "A potion restores some health.", 5, 30, "ally", "healing", "NA", "health", 50);
var grenade = new Item("Grenade", "Does fire damage to a single enemy.", 5, 30, "enemy", "damage", "NA", "NA", 50);
var full_restore = new Item("Full Restore", "Removes all status effects.", 1, 200, "ally", "utility_ally", "NA", "clear", 0);

inv.addItem(potion, player.inventory);
inv.addItem(grenade, player.inventory);
inv.addItem(full_restore, player.inventory);

var stat = new StatusController();
$(document).ready(function(){
	displayer.displayParty(player.party, "actor");
	displayer.displayParty(enemyParty.party,"enemy");
	displayer.massUpdateScreen();
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






