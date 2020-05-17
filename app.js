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

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    displayStock();
    setTimeout(function () {
        console.log('\n');
        displayMenu();
    }, 100);

    //connection.end();
})



function displayStock() {
    connection.query('select * from stock', function (err, res) {
        if (err) throw err;
        res.forEach(e => {
            console.log(`${e.item_id} | ${e.product_name} | ${e.department_name} | $${e.price} | Qty: ${e.stock_quantity}`);

        })
    })
}

function displayMenu() {

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
            if (!answers.itemID || !answers.amount){
                console.log('Please enter a valid item id and quantity.');
                connection.end();
                return;
            }
            connection.query(`select * from stock where item_id=${answers.itemID}`, function (err, res) {
                if (err) throw err;
                if (answers.amount > res[0].stock_quantity) {
                    console.log('Not enough stock to fulfill order. Please try again.');
                    connection.end();
                    return;
                }
                let qty = res[0].stock_quantity - answers.amount;
                let total = res[0].price * answers.amount;
                connection.query(`update stock set stock_quantity=${qty} where item_id=${answers.itemID}`, function (err, res) {
                    if (err) throw err;
                    console.log(`Order has been placed. Your total is $${total}. Thank you for shopping at Bamazon.`);
                    connection.end();
                });
            })
            }
        )}