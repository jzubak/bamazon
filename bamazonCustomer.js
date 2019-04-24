var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Monday15!",
    //this will need to be commented out to create a new DB using the "createdDB" function
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    inquirer.prompt([
        {
            type: "input",
            name: "bamazon",
            message: "What is the ID Number of the item you want to buy?"
        }]).then(function(itemquery) {
            console.log(itemquery)
                connection.query("select * from products where item_id = ?", itemquery.bamazon, function (err, res) {
                    if (err) throw err;
                    for (var i = 0; i < res.length; i++) {
                        console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
                    }
                    connection.end();
                })
            })
       
    });

