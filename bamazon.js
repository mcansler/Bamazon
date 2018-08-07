var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host:"localhost",
    port:3306,
    user:"root",
    password:"",
    database:"bamazon"
});

connection.connect(function(err){
    if (err) throw err;
    console.log("Connection Successfull!");
    makeTable();
});

var makeTable = function(){
    connection.query("SELECT * FROM products", function(err,res){
        for(var i=0; i<res.length; i++){
            console.log("ID- " + res[i].itemid + " || " + res[i].productname + " || " + res[i].departmentname + " || "
                        + res[i].price + " || " + res[i].stockquantity + "\n");
        }
    promptCustomer(res);    
    });
}

var promptCustomer = function(res){
    inquirer.prompt([{
        type:"input",
        name:"choice",
        message:"What would you like to purchase? Enter the ID number of the product you would like to purchase. [Enter 0 to Quit]",
        validate: function(value){
             if(isNaN(value) == false){
                 return true;
             } else {
                 return false;
             }
        }
    }]);
    .then(function(answer){
        var correct = false;
        // if(answer.choice.toUpperCase() === "Q"){
        //     process.exit();
        // }
        if(answer.choice == 0){
            process.exit();
        }
        for(var i=0; i<res.length; i++){
            if(res[i].itemid == answer.choice){
                correct = true;
                var product = res[i].productname;
                var id = i;
                inquirer.prompt({
                    type:"input",
                    name:"quantity",
                    message:"How many would you like to buy?",
                    validate: function(value){
                        if(isNaN(value) == false){
                            return true;
                        } else {
                            return false;
                        }
                    }
                })
                .then(function(answer){
                    if((res[id].stockquantity - answer.quantity) > 0){
                        var quant = res[id].stockquantity - answer.quantity;
                        var query = connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                              {
                                stockquantity: quant
                              },
                              {
                                productname: product
                              }
                            ],
                            function(err,res2){
                                console.log("Product Bought!");
                                makeTable();
                            }
                        );    
                    } else {
                        console.log("Not a valid selection!");
                        promptCustomer(res)
                    }           
                });
                // .then(function(answer){
                //     if((res[id].stockquantity - answer.quantity) > 0){
                //         connection.query("UPDATE products SET stockquantity = "
                //         + (res[id].stockquantity - answer.quantity) + "WHERE productname = " + 
                //         product, function(err,res2){
                //                 console.log("Product Bought!");
                //                 makeTable();
                //             })
                //     } else {
                //         console.log("Not a valid selection!");
                //         promptCustomer(res)
                //     }
                // })
            } 
        }
        if(answer.choice > res.length){
            console.log("Not a valid selection!");
            promptCustomer(res)
        }
        // if(i == res.length && correct == false){
        //     console.log("Not a valid selection!");
        //     promptCustomer(res)
        // }
    });
}