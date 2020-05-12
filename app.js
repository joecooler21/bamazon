var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "Scat1982Pack",
    database: "bamazon_db"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    displayStock();
    setTimeout(function() {
        console.log('\n');
        displayMenu();
    }, 100);
    connection.end();
  })

  

     function displayStock() {
        connection.query('select * from stock', function (err, res) {
            if (err) throw err;
            res.forEach(e => {
                console.log(`${e.item_id} | ${e.product_name} | ${e.department_name} | $${e.price} | Qty: ${e.stock_quantity}`);
                
            })
        })
    }

    function displayMenu () {
      
        inquirer
        .prompt([{
            name: 'itemID',
            type: 'input',
            message: 'Enter ID of the product you wish you purchase: ',
    
        },
        {
            name: 'amount',
            type: 'input',
            message: 'Enter the quantity: ',
        }
            /* Pass your questions in here */
        ])
        .then(answers => {
            console.log(answers.itemID);
            console.log(answers.amount);
            // Use user feedback for... whatever!!
        })
        .catch(error => {
            if (error.isTtyError) {
                // Prompt couldn't be rendered in the current environment
            } else {
                // Something else when wrong
            }
        });
    }