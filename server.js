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
            viewEmployees();
        } else if (answer.toDo === "View all employees by Department") {
             //insert function for viewing all employees by dept
            viewDept();  
        } else if (answer.toDo === "View all employees by Manager") {
            //insert function for viewing all employees by manager
            viewManager();
        } else if (answer.toDo === "Add Employee") {
            //insert function for adding employee
            addEmployee();
        } else if (answer.toDo === "Remove Employee") {
            //insert function for removing employee
            removeEmployee();
        } else if (answer.toDo === "Update Employee Role") {
            //insert function for updating employee role
            updateRole();
        } else if (answer.toDo === "Update Employee Manager") {
            //insert function for updating employee manager
            updateManager();
        } else if (answer.toDo === "Add Role") {
            //insert function for adding role
            addRole();
        } else if (answer.toDo === "View All Roles") {
            //insert function for viewing all roles
            viewRoles();

        } else {
            connection.end();
            console.log("Bye Nina")
        };
    })
}

function viewEmployees() {
    console.log("View All Emps Test");
};

function viewDept() {
    console.log("View All Emps by Department test");
};

function viewManager() {
    console.log("View All Emps by Manager test");
};

function addEmployee() {
    console.log("Add Employee Test");
};
function removeEmployee() {
    console.log("Remove Emp Test");
};
function updateRole() {
    console.log("Update Role Test");
};
function updateManager() {
    console.log("Update Manager Test");
};
function addRole() {
    console.log("Add Role Test");
};
function viewRoles() {
    console.log("View All Roles Test")
};