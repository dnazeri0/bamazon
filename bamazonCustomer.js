var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "Bamazon"
});

function validateInput(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return "Enter a number greater than zero.";
	}
}

function promptUserPurchase() {
	inquirer.prompt([
		{
			type: "input",
			name: "item_id",
			message: "Enter item ID of item.",
			validate: validateInput,
			filter: Number
		},
		{
			type: "input",
			name: "quantity",
			message: "Enter quantity.",
			validate: validateInput,
			filter: Number
		}
	]).then(function(input) {
		var item = input.item_id;
		var quantity = input.quantity;

		var queryStr = "SELECT * FROM products WHERE ?";

		connection.query(queryStr, {item_id: item}, function(err, data) {
			if (err) throw err;

			if (data.length === 0) {
				console.log("Invalid item ID. Enter a valid ID.");
				displayInventory();

			} else {
				var productData = data[0];

				if (quantity <= productData.stock_quantity) {
					console.log("Item back in stock. Order placed.");

					var updateQueryStr = "UPDATE products SET stock_quantity = " + (productData.stock_quantity - quantity) + " WHERE item_id = " + item;

					connection.query(updateQueryStr, function(err, data) {
						if (err) throw err;

						console.log("Your total is $",productData.price * quantity);

						// End the database connection
						connection.end();
					})
				} else {
					console.log("Not enough stock.")

					displayInventory();
				}
			}
		})
	})
}

function displayInventory() {
	
}

