var playerLevel = 1;

var baseData = {
	"warrior": {
		health: 300,
		maxHealth: 300,
		mana: 50,
		maxMana: 50,
		sp: 70,
		maxSp: 70,
		ultimate: 0,
		maxUltimate: 10,
		attack: 30,
		defense: 10,
		magic: 5,
		resistance: 5
	},

	"mage": {
		health: 200,
		maxHealth: 200,
		mana: 150,
		maxMana: 150,
		sp: 60,
		maxSp: 60,
		ultimate: 0,
		maxUltimate: 10,
		attack: 10,
		defense: 5,
		magic: 30,
		resistance: 10
	},

	"healer": {
		health: 220,
		maxHealth: 220,
		mana: 150,
		maxMana: 150,
		sp: 70,
		maxSp: 70,
		ultimate: 0,
		maxUltimate: 10,
		attack: 5,
		defense: 5,
		magic: 25,
		resistance: 12
	}
}

var mobData = [];

mobData.push(enemyParty.createActor("Amanogawa", "img/amanogawa.jpg", baseData["warrior"], "warrior", playerLevel, "Earth", "Human", "Warrior", 0.10));
mobData.push(enemyParty.createActor("Yumi", "img/yumi.png", baseData["warrior"], "warrior", playerLevel, "Dark", "Human", "Warrior", 0.10));
mobData.push(enemyParty.createActor("Twilight", "img/twilight.jpg", baseData["mage"], "mage", playerLevel, "Dark", "Pony", "Alicorn", 0.15));
mobData.push(enemyParty.createActor("Kagome", "img/kagome.jpg", baseData["warrior"], "warrior", playerLevel, "Wind", "Human", "Archer", 0.15));
mobData.push(enemyParty.createActor("Hotaru", "img/hotaru.jpg", baseData["healer"], "healer", playerLevel, "Earth", "Human", "Confectioner", 0.10));