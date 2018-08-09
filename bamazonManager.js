var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host:"localhost",
    port:3306,
    user:"root",
    password:"",
    database:"bamazon"
})

connection.connect(function(err){
    if (err) throw err;
    console.log("Connection Successfull!");
    menu();
})

function menu() {
    inquirer
      .prompt({
        name: "action",
        type: "rawlist",
        message: "What would you like to do?",
        choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product",
          "Quit"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
            case "View Products for Sale":
                viewProducts();
                break;
  
            case "View Low Inventory":
                lowInventory();
                break;
  
            case "Add to Inventory":
                addInventory();
                break;
  
            case "Add New Product":
                addProduct();
                break;

            case "Quit":
                quitProgram();
                break;
        }
      });
  }

function viewProducts(){
    connection.query("SELECT * FROM products", function(err,res){
        for(var i=0; i<res.length; i++){
            console.log("ID- " + res[i].itemid + " || " + res[i].productname + " || " + res[i].departmentname + " || "
                        + res[i].price + " || " + res[i].stockquantity + "\n");
        }
        menu();
    });
}

function lowInventory(){
    connection.query("SELECT * FROM products WHERE stockquantity < 5", function(err,res){
        for(var i=0; i<res.length; i++){
            console.log("ID- " + res[i].itemid + " || " + res[i].productname + " || " + res[i].departmentname + " || "
                        + res[i].price + " || " + res[i].stockquantity + "\n");
        }
        menu();
    });
}

function addInventory(){
    
    inquirer.prompt([{
        type:"input",
        name:"choice",
        message:"Which product would you like to update? Enter the ID number of the product you would like to update. [Enter 0 to Return to Menu]",
        validate: function(value){
             if(isNaN(value) == false){
                 return true;
             } else {
                 return false;
             }
        }
    }])
    .then(function(answer){
        var correct = false;
        
        if(answer.choice == 0){
            menu();
        }
         else{
            connection.query("SELECT * FROM products", function(err, res) {
                if (err) throw err;

                if(answer.choice > res.length){
                    console.log("Not a valid selection!");
                    addInventory();
                }
                else {
                for(var i=0; i<res.length; i++){
                    if(res[i].itemid == answer.choice){
                        correct = true;
                        var product = res[i].productname;
                        var quantity = res[i].stockquantity;
                        var id = i;
                    } 
                    // else {
                    //     console.log("Not a valid selection!");
                    //     addInventory();
                    // }
                }
                addInventoryTwo(product,quantity);
                }
            });
        }
    });
}            
                            
                
function addInventoryTwo(product,quantity){                
    
    inquirer.prompt({
        type:"input",
        name:"quantity",
        message:"How many would you like to add?",
        validate: function(value){
            if(isNaN(value) == false){
                return true;
            } else {
                return false;
            }
        }
    })
    .then(function(answer){
                    
        var quant = parseInt(answer.quantity) + parseInt(quantity);
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
            function(err,res){
                console.log("Product Updated!");
                console.log(product + " - Quantity: " + quant + "\n");
                            
                menu();
            }
        );    
    });             
                
                
}

function addProduct(){

    inquirer.prompt([
        {
            type:"input",
            name:"product",
            message:"Enter product name:"
        },
        {
            type:"input",
            name:"department",
            message:"Enter department name:"
        },
        {
            type:"input",
            name:"price",
            message:"Enter the price:",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
            }
        },
        { 
            type:"input",
            name:"quantity",
            message:"Enter the quantity:",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                    return false;
            }
        },
        {
            type: "confirm",
            message: "Is this information correct?",
            name: "confirm",
            default: true
          }
    ])
    .then(function(answer){

        if(answer.confirm){
            var query = connection.query(
                "INSERT INTO products SET ?",
                {
                    productname: answer.product,
                    departmentname: answer.department,
                    price: answer.price,
                    stockquantity: answer.quantity
                },
                function(err, res) {
                    console.log("Product Added!");
                    console.log(answer.product + " || " + answer.department + " || " + answer.price + " || " + answer.quantity);
                    menu();
                }
            );
        }
        else {
            addProduct();
        }
    });
}

function quitProgram(){

    process.exit(); 
}

        
        