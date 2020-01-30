//** INITIALIZATION **//
var player = new Player("rangikufan999");
var enemyParty = new EnemyParty();
var displayer = new Display();
var combat = new Combat(0, 0, false, 0, 0, 1);
var actions = new Actions();
var log = new Log();
var dieRoll = new DieRoll();
var damageReduction = new DamageReduction();
var inv = new Inventory();
var crit = new Crit();
var db = new DamageBonus();
var saveSystem = new FileManager();
var field = new Field("Swamp", "Shrek's Swamp; dirty, wet, and smelly.", ["Earth", "Water"], ["Fire", "Wind"], "buffOrDebuff", 400, new Ability("Swamp Gas", "Swampy gases attack all those whom are weak to it but empowers those whom are strong to it.", 1, "Earth", "damage", "single", "special", "no", 0, 0, 0, new StatusEffect("Gased", "This unit has been gassed", "Buff", "buff", 2, 20, "attack"), 1.00), new Ability("Swamp Gas", "Swampy gases attack all those whom are weak to it but empowers those whom are strong to it.", 1, "Earth", "damage", "single", "special", "no", 0, 0, 0, new StatusEffect("Gased", "This unit has been gassed", "Buff", "debuff", 2, 20, "defense"), 1.00));
var elemental = new Elemental();
var stat = new StatusController();



$(document).ready(function(){

	var file = saveSystem.loadFile("player");
	if(file == null || file == undefined || file == ""){
		console.log("File not found!");
		saveSystem.saveFile("player", player);
	}else{
		player = saveSystem.loadFile("player");
		console.log(file.accountName);
	}

	enemyParty.randomizeParty(3, mobData);

	displayer.displayParty(player.party, "actor");
	displayer.displayParty(enemyParty.party,"enemy");
	displayer.massUpdateScreen();
	log.print("--------- Turn: " + combat.turnCount + " [Player's Turn] ---------");
	combat.initiateTurn();

	$("#attack").click(function(){
		actions.attack();
	});

	$("#ability").click(function(){
		actions.ability();
	});
});