class Item{
	constructor(name, tooltip, quantity, price, target, modify_type, utility, stat, amount){
		this.details = {	
			name: name,
			tooltip: tooltip
		};

		this.identity = {
			target: target,
			modify_type: modify_type,
			utility: utility
		};

		this.stats = {
			quantity: quantity,
			price: price,
			stat: stat,
			amount: amount
		};
	}
}


class Inventory{
	constructor(){}

	removeItem(index, arr){
		arr.splice(index, 1);
	}

	addItem(item, arr){
		arr.push(item);
	}

	checkItemQuantity(item){
		if(item.stats.quantity <= 0){
			var index = player.inventory.indexOf(item);
			inv.removeItem(index, player.inventory);
		}
	}

	reduceItemQuantity(item){
		item.stats.quantity -= 1;
		inv.checkItemQuantity(item);
	}
}