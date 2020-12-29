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

//Function to view all current employees
function viewEmployees() {
    console.log("View All Emps Test");
    let query = 
    "SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id FROM employee";
    return connection.query(query, function (err, res) {
       if (err) throw err;
        console.table(res);
        start();
    });

};

//Function to view all employees based on department
function viewDept() {
    console.log("View All Emps by Department test");
};

//Function to view all employees by their manager
function viewManager() {
    console.log("View All Emps by Manager test");
};

//Function to add and Employee to the list
function addEmployee() {
    console.log("Add Employee Test");
    inquirer
    .prompt([
        {
            name: "firstname",
            type: "input",
            message: "What is the employee's first name?"
        },
        {
            name: "lastname",
            type: "input",
            message: "What is the employee's last name?"
        },
        {
            name: "employeeRole",
            type: "input",
            message: "What is the employee's role ID?"
        },
        {
            name: "managerId",
            type: "input",
            message: "What is the employee's manager id?"
        }
    ])
    .then(function(answer) {
        connection.query(
            "INSERT INTO employee SET ?",
            {
                first_name: answer.firstname,
                last_name: answer.lastname,
                role_id: answer.employeeRole || 0,
                manager_id: answer.managerId || 0
            },
            function(err) {
                if (err) throw err;
                console.log("The employee has been added successfully!");
                start();
            }
        );
    });
};

//Function to remove an employee
function removeEmployee() {
    console.log("Remove Emp Test");
};

//Function to update Roles
function updateRole() {
    console.log("Update Role Test");
};

//Function to update Manager
function updateManager() {
    console.log("Update Manager Test");
};

//Function to add a role
function addRole() {
    console.log("Add Role Test");
    inquirer
    .prompt([
        {
            name: "deptName",
            type: "input",
            message: "What Role would you like added to the department list?"
        }
    ])
    .then(function(answer) {
        connection.query(
            "INSERT INTO department SET ?",
            {
                dept_name: answer.deptName
            },
            function(err) {
                if (err) throw err;
                console.log("The department has been added successfully!")
                start();
            }
        )
    })
};

//Function to view all roles
function viewRoles() {
    console.log("View All Roles Test")
};