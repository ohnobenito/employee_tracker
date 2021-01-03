//require dependancies
const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const chalk = require("chalk");
const logo = require('asciiart-logo');


//TO USE APPLICATION:
//Please enter in your mysql password to connect to sql database
let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "fetacheese",
    database: "employee_db"
});

//empty arrays for roles, departments, employees, and managers
let rolesarray = [];
let departmentsarray = [];
let employeesarray = [];
let managersarray = [];

// connect to the mysql server
connection.connect(function(err) {
    if (err) throw err;
    init();
});

//ascii art logo
function init() {
    const logoText = logo
        ({
        name: "Content Management System",
        font: "Colossal",
        fontSize: "5px",
        borderColor: "blue",
        logoColor: "red",
        textColor: "bold-black",
        })
    .render();
    console.log(logoText);
    start();
};

//-------------------
// --- START MENU ---
//-------------------

function start() {
    //Run functions to make empty arrays at start
    roleArray();
    departmentArray();
    employeeArray();
    managerArray();

    inquirer
    .prompt({
        name: "toDo",
        type: "list",
        message: "Would you like to do?",
        choices: [
            "Add Role", 
            "Add Department", 
            "Add Employee",
            "View all employees", 
            "View all employees by Department", 
            "View all employees by Manager", 
            "View All Roles",
            "View All Departments",
            "Update Employee Role", 
            "Update Employee Manager",
            "Remove Employee", 
            "Remove Role", 
            "Remove Department", 
             "Exit"
        ]
    })
    .then(function(answer) {
    switch (answer.toDo) {
        case 'Add Role':
            addRole();
            break;
        case 'Add Department':
            addDepartment();
            break;
        case 'Add Employee':
            addEmployee();
            break;
        case 'View all employees':
            viewEmployees();
            break;
        case 'View all employees by Department':
            viewEmpDept();
            break;
        case 'View all employees by Manager':
            viewManager();
            break;
        case 'View All Roles':
            viewRoles();
            break;
        case 'View All Departments':
            viewDepartments();
            break;
        case 'Update Employee Role':
            updateRole();
            break;
        case 'Update Employee Manager':
            updateManager();
            break;
        case 'Remove Employee':
            removeEmployee();
            break;
        case 'Remove Role':
            removeRole();
            break;
        case 'Remove Department':
            removeDepartment();
            break;
        case 'Exit':
            connection.end();
            console.log(chalk.blue('Thank you for using the Employee Management System. Goodbye.'));
            break;
        default:
            return;
        };
    });  
};

//-------------------------
// --- EMPLOYEE SECTION --- 
//-------------------------

//FUNCTION TO VIEW ALL EMPLOYEES
function viewEmployees() {
    let query = 
    "SELECT employee.id, employee.first_name, employee.last_name, person_role.title, person_role.salary, department.dept_name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN person_role on person_role.id = employee.role_id INNER JOIN department on department.id = person_role.department_id left join employee e on employee.manager_id = e.id;";
    return connection.query(query, function (err, res) {
       if (err) throw err;
        console.table(res);
        start();
    });
};

//FUNCTION TO ADD AN EMPLOYEE
function addEmployee() {
    //Add this answer to manager question
    managersarray.push('This Employee is a manager.');

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
            type: "list",
            choices: rolesarray,
            message: "What is the employee's role?"
        },
        {
            name: "managerId",
            type: "list",
            choices: managersarray,
            message: "Please choose the employees manager"
        }
    ])
    .then(function(answer) {
        if (answer.managerId === "none") {
            answer.managerId = null;

            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answer.firstname,
                    last_name: answer.lastname,
                    role_id: answer.employeeRole[0],
                    manager_id: answer.managerId
                },
                function(err) {
                    if (err) throw err;
                    console.log(chalk.blue("The employee has been added successfully!"));
                    start();
                }
            );
        } else {
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answer.firstname,
                    last_name: answer.lastname,
                    role_id: answer.employeeRole[0],
                    manager_id: answer.managerId[0]
                },
                function(err) {
                    if (err) throw err;
                    console.log(chalk.blue("The employee has been added successfully!"));
                    start();
                }
            );
        };
    });
};

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
                    console.log(chalk.red("Employee has been successfully removed!"));
                    start();
                    })
                };
            };
        });
    });
};

//FUNCTION TO UPDATE MANAGER
function updateManager() {
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
                message: "Which employee would you like to update the manager for?"
            },
        ])
        .then(function(answer) {
            let employee_id;
                for (let i = 0; i < results.length; i++) {
                    if (results[i].first_name + " " + results[i].last_name === answer.empNames) {
                    employee_id = results[i].id;
                    console.log("This is the emp ID " + employee_id);
                    };
                };
      
            connection.query("SELECT * FROM employee", function(err,results) {
                if (err) throw (err);
      
                inquirer
                .prompt([
                    {
                        name: "manager",
                        type: "list",
                        choices: function() {
                            let manArray = [];
                            for (let i = 0; i < results.length; i++) {
                                if (results[i].manager_id === null) {
                                manArray.push(results[i].first_name + " " + results[i].last_name);
                                }
                            }
                            return manArray;
                        },
                        message: "Please select a manager to update the employee to:"
                    }
                ])
                .then(function(answer) {
                    let man_id;
                    for (let i = 0; i < results.length; i++) {
                        if (results[i].first_name + " " + results[i].last_name === answer.manager) {
                            man_id = results[i].id;
                            
                        };
                    };

                    let queryAnswer = [man_id, employee_id]
                    connection.query("UPDATE employee SET manager_id = ? WHERE employee.id = ?", queryAnswer, (err, res) => {
                        if (err) throw err;
                        console.log(chalk.green("Employee was successfully updated!"));
                        start();
                    });
                });
            });
        });
    });   
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
                console.log(chalk.blue("The department has been added successfully!"));
                start();
            }
        );
    });
};

//FUNCTION TO VIEW ALL DEPARTMENTS
function viewDepartments() {
    
    let query =
    "SELECT department.id, department.dept_name FROM department";
    return connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
};

  //FUNCTION TO REMOVE DEPARTMENT
  function removeDepartment() {
    connection.query("SELECT * FROM department", function(err,results) {
        if (err) throw err;
       
        inquirer
        .prompt([
            {
                name: "removeDepartment",
                type: "list",
                choices: function() {
                    let removeArray = [];
                    for (let i = 0; i < results.length; i++) {
                        removeArray.push(results[i].dept_name);
                    }
                    return removeArray;
                },
                message: "Which department would you like to remove?"
            }
        ])
        .then(function(answer) {
            let departId;
            for (let i = 0; i < results.length; i++) {
                if (results[i].dept_name === answer.removeDepartment) {
                    departId = results[i].id;

                    connection.query(
                        "DELETE FROM department WHERE id = ?", departId, (err,res) => {
                    if (err) throw err;
                    console.log (chalk.red("Department has been successfully removed!"));
                    start();
                    })
                };
            };
        });
    });
};

//FUNCTION TO VIEW ALL EMPLOYEES BY DEPARTMENT
function viewEmpDept() {
    inquirer
    .prompt([
        {
            name: "viewDept",
            type: "list",
            choices: departmentsarray,
            message: "Please choose which department you'd like to view employees of"
        }
    ])
    .then(function(answer) {
        let query = answer.viewDept[0]  
        connection.query(
        "SELECT employee.id, employee.first_name, employee.last_name, person_role.title, person_role.salary, department.dept_name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN person_role on person_role.id = employee.role_id INNER JOIN department on department.id = person_role.department_id left join employee e on employee.manager_id = e.id WHERE department.id = ?", query, (err, res) => {
            if (err) throw err;
            console.table(res);
            start();
        });
    });
};

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
        },
        {
            name: "department",
            type: "list",
            choices: departmentsarray,
            message: "Please select which department this role belongs to"
        }
    ])
    .then(function(answer) {
        if (answer.salary === isNaN) {
            console.log("You must enter a valid number")
        } else {
            connection.query(
                "INSERT INTO person_role SET ?",
                {
                   title: answer.title,
                   salary: answer.salary,
                   department_id: answer.department[0]
                },
                function(err) {
                    if (err) throw err;
                    console.log(chalk.blue("The role was added successfully!"));
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
                };
            };
      
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
                        console.log(chalk.green("Employee was successfully updated!"));
                        start();
                    });
                });
            });
        });
    });
};

//FUNCTION TO REMOVE ROLE
function removeRole() {
    connection.query("SELECT * FROM person_role", function(err,results) {
        if (err) throw err;
       
        inquirer
        .prompt([
            {
                name: "removeRoles",
                type: "list",
                choices: function() {
                    let removeArray = [];
                    for (let i = 0; i < results.length; i++) {
                        removeArray.push(results[i].title);
                    }
                    return removeArray;
                },
                message: "Which role would you like to remove?"
            }
        ])
            .then(function(answer) {
                let role_id;
                for (let i = 0; i < results.length; i++) {
                    if (results[i].title === answer.removeRoles) {
                    role_id = results[i].id;

                    let query = role_id;
                    connection.query("DELETE FROM person_role WHERE person_role.id = ?", query, (err,res) => {
                    if (err) throw err;
                    console.log(chalk.red("Role has been successfully removed!"));
                    start();
                    })
                };
            };
        });
    });
};

//FUNCTION TO VIEW ALL EMPLOYEES BY MANAGER
function viewManager() {
    inquirer
    .prompt([
        {
            name: "viewManager",
            type: "list",
            choices: managersarray,
            message: "Please choose which manager you'd like to view employees of"
        }
    ])
    .then(function(answer) {
        let query = answer.viewManager[0]  
        connection.query(
        "SELECT employee.id, employee.first_name, employee.last_name, person_role.title, person_role.salary, department.dept_name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN person_role on person_role.id = employee.role_id INNER JOIN department on department.id = person_role.department_id left join employee e on employee.manager_id = e.id WHERE employee.manager_id = ?", query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
        });
    });
};

//---------------------
// --- EMPTY ARRAYS ---
//---------------------

function roleArray() {
    connection.query("SELECT * FROM person_role", (err, results) => {
        if (err) throw err;
        rolesarray = [];
        for (let i = 0; i < results.length; i++) {
            rolesarray.push(results[i].id + " " + results[i].title)
        };
    });
};

function employeeArray () {
    connection.query("SELECT * FROM employee", (err, results) => {
        if (err) throw err;
        employeesarray = [];
        for (let i = 0; i < results.length; i++) {
            employeesarray.push(results[i].id + " " + results[i].first_name + " " + results[i].last_name)
        };
    });
};

function departmentArray() {
    connection.query("SELECT * FROM department", (err, results) => {
        if (err) throw err;
        departmentsarray = [];
        for (let i = 0; i < results.length; i++) {
            departmentsarray.push(results[i].id + " " + results[i].dept_name)
        };
    });
};

function managerArray() {
    connection.query("SELECT * FROM employee WHERE manager_id IS null", (err, results) => {
        if (err) throw err;
        managersarray = [];
        for (let i = 0; i < results.length; i++) {
            managersarray.push(results[i].id + " " + results[i].first_name + " " + results[i].last_name)
        };
    });
};