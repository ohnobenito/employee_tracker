let mysql = require("mysql");
let inquirer = require("inquirer");
let consoleTable = require("console.table");

let roles = [];
let depts = [];
let employees = [];

//connect to sql database
let connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "fetacheese",
    database: "employee_db"
});

// connect to the mysql server
connection.connect(function(err) {
    if (err) throw err;
start();
})
//START FUNCTION
function start() {
    employee();
    depart();
    role();
    inquirer
    .prompt({
        name: "toDo",
        type: "list",
        message: "Would you like to do?",
        choices: ["View all employees", "View all employees by Department", "View all employees by Manager", "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager", "Add Role", "View All Roles", "Add Department", "View All Departments", "Exit"]
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

        } else if (answer.toDo === "Add Department") {
            addDepartment();
        } else if (answer.toDo === "View All Departments") {
            viewDepartments();
        } else {
            connection.end();
            console.log("Bye Nina")
        };
    })
}

//-------------------------
// --- EMPLOYEE SECTION --- 
//-------------------------

//FUNCTION TO VIEW ALL EMPLOYEES
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

//FUNCTION TO ADD AN EMPLOYEE
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

// FUNCTION TO ADD EMPLOYEE INFO TO EMPTY ARRAY
function employee() {
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        employees = [];
        for (let i = 0; i < res.length; i++) {
            employees.push(res[i].id + " " + res[i].first_name + " " + res[i].last_name + " " + res[i].role_id + " " + res[i].manager_id);
        }
    });
    return employees;
}

//FUNCTION TO REMOVE EMPLOYEE
function removeEmployee() {
    connection.query("SELECT * FROM employee", function(err,results) {
        if (err) throw err;
       
        inquirer
        .prompt([
            {
                name: "removeNames",
                type: "list",
                choices: function() {
                    let removeArray = [];
                    for (let i = 0; i < results.length; i++) {
                        removeArray.push(results[i].first_name + " " + results[i].last_name);
                    }
                    return removeArray;
                },
                message: "Which employee would you like to remove?"
            }
        ])
            .then(function(answer) {
                let employee_id;
                for (let i = 0; i < results.length; i++) {
                    if (results[i].first_name + " " + results[i].last_name === answer.removeNames) {
                    employee_id = results[i].id;
                    console.log("This is the emp ID " + employee_id);
                    let query = employee_id
                        connection.query("DELETE FROM employee WHERE employee.id = ?", query, (err,res) => {
                        if (err) throw err;
                        console.log ("Employee has been successfully removed!");
                        start();
                        })
                    }
                }
            })
        })
    };

//---------------------------
// --- DEPARTMENT SECTION ---
//---------------------------

//FUNCTION TO ADD A DEPARTMENT
function addDepartment() {
    inquirer
    .prompt([
        {
            name: "deptName",
            type: "input",
            message: "What would you like added to the department list?"
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

//FUNCTION TO VIEW ALL DEPARTMENTS
function viewDepartments() {
    console.log ("View All Departments Test")
    let query =
    "SELECT department.id, department.dept_name FROM department";
    return connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
};

//FUNCTION TO ADD ALL DEPARTMENTS TO EMPTY ARRAY
function depart() {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        depts = [];
        for (let i = 0; i < res.length; i++) {
            depts.push(res[i].id + " " + res[i].dept_name);
        }
    });
    return depts;
}

//----------------------
// --- ROLES SECTION ---
//----------------------

//FUNCTION TO ADD A ROLE
function addRole() {
    inquirer
    .prompt([
        {
            name: "title",
            type: "input",
            message: "What is the role you would like added?"
        },
        {
            name: "salary",
            type: "input",
            message: "What is this role's salary?"
        }
    ])
    .then(function(answer) {
        if (answer.salary === NaN) {
            console.log ("You must enter a number")
        } else {
            connection.query(
                "INSERT INTO person_role SET ?",
                {
                   title: answer.title,
                   salary: answer.salary 
                },
                function(err) {
                    if (err) throw err;
                    console.log ("The role was added successfully!");
                    start();
                }
            );
        };
    });
};

//FUNCTION TO VIEW ALL ROLES
function viewRoles() {
    console.log("View All Roles Test")
    let query =
    "SELECT person_role.id, person_role.title, person_role.salary, person_role.department_id FROM person_role";
    return connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        start()
    })
};
// FUNCTION TO ADD ALL ROLES TO EMPTY ARRAY
function role() {
    connection.query("SELECT * FROM person_role", (err, res) => {
        if (err) throw err;
        roles = [];
        for (let i = 0; i < res.length; i++) {
            roles.push(res[i].id + " " + res[i].title + " " + res[i].salary + " " + res[i].manager_id);
        }
    });
    return roles;
}
//FUNCTION TO UPDATE ROLES
function updateRole() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, employee.role_id FROM employee", function(err,results) {
        if (err) throw err;
       
        inquirer
        .prompt([
            {
                name: "empNames",
                type: "list",
                choices: function() {
                    let empArray = [];
                    for (let i = 0; i < results.length; i++) {
                        empArray.push(results[i].first_name + " " + results[i].last_name);
                    }
                    return empArray;
                },
                message: "Which employee would you like to update the role for?"
            },
        ])
        .then(function(answer) {
            let employee_id;
                for (let i = 0; i < results.length; i++) {
                    if (results[i].first_name + " " + results[i].last_name === answer.empNames) {
                    employee_id = results[i].id;
                    console.log("This is the emp ID " + employee_id);
                }
            }
      
            connection.query("SELECT * FROM person_role", function(err,results) {
                if (err) throw (err);
      
                inquirer
                .prompt([
                    {
                        name: "roles",
                        type: "list",
                        choices: function() {
                            let roleArray = [];
                            for (let i = 0; i < results.length; i++) {
                                roleArray.push(results[i].title);
                            }
                            return roleArray;
                        },
                        message: "Please select a role to update the employee to:"
                    }
                ])
                .then(function(answer) {
                    let role_id;
                    for (let i = 0; i < results.length; i++) {
                        if (results[i].title === answer.roles) {
                            role_id = results[i].id;
                            console.log ("This is the role id " + role_id);
                        }
                    }

                    let queryAnswer = [role_id, employee_id]
                    connection.query("UPDATE employee SET role_id = ? WHERE employee.id = ?", queryAnswer, (err, res) => {
                        if (err) throw err;
                        console.log ("Employee was successfully updated!");
                        start();
                    })
                })
      
            })
        })
      })
}

//-------------------
// --- LEFT TO DO ---
//-------------------

//Function to view all employees based on department
function viewDept() {
    console.log("View All Emps by Department test");

};

//Function to view all employees by their manager
function viewManager() {
    console.log("View All Emps by Manager test");
};


//Function to update Manager
function updateManager() {
    console.log("Update Manager Test");
};