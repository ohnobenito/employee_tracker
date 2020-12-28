let mysql = require("mysql");
let inquirer = require("inquirer");
let consoleTable = require("console.table");

//connect to sql database
let connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "",
    database: "employee_db"
});

// connect to the mysql server
connection.connect(function(err) {
    if (err) throw err;
start();
})

function start() {
    inquirer
    .prompt({
        name: "toDo",
        type: "list",
        message: "Would you like to do?",
        choices: ["View all employees", "View all employees by Department", "View all employees by Manager", "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager", "Add Role", "View All Roles", "Exit"]
    })
    .then(function(answer) {
        //if statements for each possible answer
        if (answer.toDo === "View all employees") {
            //insert function for viewing all employees
        } else if (answer.toDo === "View all employees by Department") {
            //insert function for viewing all employees by dept
        } else if (answer.toDo === "View all employees by Manager") {
            //insert function for viewing all employees by manager
        } else if (answer.toDo === "Add Employee") {
            //insert function for adding employee
        } else if (answer.toDo === "Remove Employee") {
            //insert function for removing employee
        } else if (answer.toDo === "Update Employee Role") {
            //insert function for updating employee role
        } else if (answer.toDo === "Update Employee Manager") {
            //insert function for updating employee manager
        } else if (answer.toDo === "Add Role") {
            //insert function for adding role
        } else if (answer.toDo === "View All Roles") {
            //insert function for viewing all roles
        } else {
            connection.end();
        }
    })
}