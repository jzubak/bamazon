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
    // connection.query(list)
    inquirer.prompt([
        {
            type: "list",
            name: "bamazonsearch",
            message: "How would you like to search for an item?",
            choices: ["Item ID", "Product Name", "Product Department", "Price Range"]


        }]).then(function (choices) {
            if (choices.bamazonsearch === "Item ID") {
                byItemId()
            };
            // if (choices.bamazonsearch === "Product Name") {
            //     byProduct()
            // }
            // if (choices.bamazonsearch === "Product Department") {
            //     byDepartment()
            // }
            // if (choices.bamazonsearch === "Price Range") {
            //     byPrice()
            // }

        });


    function byItemId(itemsearch) {
        inquirer.prompt([
            {
                type: "input",
                name: "bamazon",
                message: "What is the ID Number of the item you want to buy?"
            }]).then(function (itemquery) {
                connection.query("select * from products where item_id = ?", itemquery.bamazon, function (err, res) {
                    var item = res[0];
                    if (err) throw err;
                    // for (var i = 0; i < res.length; i++) {
                    console.log("You are searching for item #" + item.item_id + "\n name: " + item.product_name + "\n department: " + item.department_name + "\n unit price: " + item.price);
                    if (item.stock_quantity != 0) {
                        inquirer.prompt([
                            {
                                type: "input",
                                name: "buy",
                                message: `How many ${item.product_name} do you want to buy?`
                            }
                        ]).then(function (res) {
                            console.log(item)
                            purchase(res, item)
                        });
                        // //     function (purchase){
                        //         console.log(item)
                        //     connection.query("UPDATE products SET ? WHERE ?",
                        //     [
                        //         {
                        //             stock_quantity: `stock_quantity -${purchase.buy}`
                        //         },
                        //         {
                        //             item_id: `${item.item_id}`
                        //         }
                        //     ],
                        //     function (err, res) {
                        //         console.log(res.affectedRows + " products updated!\n");
                        //         // Call deleteProduct AFTER the UPDATE completes
                        //         // deleteProduct();
                    }
                    // }
                    // );
                    // }
                    // else console.log("I'm sorry this item is currently out of stock")
                    // outofstock();
                    // };
                })
            })

        function purchase(res, item) {
            console.log("\nUpdating the item you selected to purchase\n");
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                    {
                        stock: `stock_quantity -${purchase.buy}`
                    },
                    {
                        item_id: `${item.item_id}`
                    }
                ],
                function (err, res) {
                    console.log(res + " products updated!\n");
                    // Call deleteProduct AFTER the UPDATE completes
                    // deleteProduct();
                
                connection.end();
            });            
        }

function deleteProduct() {
    console.log("Deleting all strawberry icecream...\n");
    connection.query(
        "DELETE FROM products WHERE ?",
        {
            flavor: "strawberry"
        },
        function (err, res) {
            console.log(res.affectedRows + " products deleted!\n");
            // Call readProducts AFTER the DELETE completes
            readProducts();
        }
    );
}

function outofstock() {
    inquirer.prompt([{
        type: "list",
        name: "outofstock",
        message: "We're sorry this item is currently out of stock. Would you like to search for something else?",
        choices: ["Yes please!", "No thank you I really just wanted that item"]
    }])
    connection.end();
}
    }
});

