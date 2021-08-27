const mysql = require('mysql2');
const inquirer = require('inquirer');
const functions = require ('./functions.js');
const { connect } = require('http2');

const connection = mysql.CreateConnection({
    host: 'localhost',
    user: 'root',
    database: 'employeeTracker_db',
    port: 3001,
    password: 'folger'
    
});

connection.connection((err) => {
    if (err) throw err;
    mainPrompt();
});

const mainPrompt =() => {
    inquirer
        .prompt([{
            name: `action`,
            type: `list`,
            message: `Welcome to the Database! What would
            you like to do?`,
            choices: [
                `Add a Department`,
                `Add a Role`,
                `Add an Employee`,
                `View all Departments`,
                `View all Roles`,
                `View all Employees`,
                `View the employees of a specified Manager`,
                `View the Budget of a specified Department`,
                `Update an Employee's Role`,
                `Update an Employee's Manager`,
                `Remove a Department`,
                `Remove a Role`,
                `Remove an Employee`,
                `Exit`,
            ]
        }

    ]).then((answer) => {
        switch (answer.action) {
            case `Add a Department`:
                departmentAdd();
                break;

            case `Add a Role`:
               roleAdd();
                break;

            case `Add an Employee`:
                employeeAdd();
                break;

            case `View all Departments`:
                departmentView();
                break;

            case `View all Roles`:
                roleView();
                break;
                
            case `View all Employees`:
                employeeView();
                break;

            case `View the employees of a specified Manager`:
                employeeManagerView();
                break;

            case `View the Budget of a specified Department`:
                departmentBudget();
                break;

            case `Update an Employee's Role`:
                employeeUpdate();
                break;

             case `Update an Employee's Manager`:
                employeeManagerUpdate();
                break;

            case `Remove a Department`:
                departmentRemove();
                break;

            case `Remove a Role`:
                roleRemove();
                break;

            case `Remove an Employee`:
                employeeRemove();
                break;

            case `Exit`:
                connection.end();
                break;
        }
    })
}

//function to add a department
const departmentAdd = () => {
    inquirer
        .prompt([{
            name: `departmentAdd`,
            type: `input`,
            message: `Which department would you like to add?`,
        }])
        .then((answer) => {
            connection.query(
                "INSERT INTO department SET ?" , {
                    name: answer.departmentAdd
                },
                function (err) {
                    if (err) throw err;
                    console.log("Added " + answer.departmentAdd + " Department.");
                    mainPrompt();
                }
            )
        })
}

//function to add a role
const roleAdd = () => {
    connection.query("SELECT * FROM department", function (err, results){
        if (err) throw err;
        inquirer 
        .prompt([{
            name: `roleAdd`,
            type: `input`,
            message: `What role would you like to add?`
        },

        {
        name: `salary`,
        type: `number`,
        message: `What is the salary for this role?`
     },

     {
        name: `department_id`,
        type: `list`,
        message: `Which department does this role belong to?`,
        choices: results.map(item => item.name)
     },

    ])
    .then ((answer) => {
        const departmentChosen = results.find(item => item.name === answer.department_id)

        connection.query("INSERT INTO role SET ?", {
            title: answer.roleAdd,
            salary: answer.salary,
            department_id: departmentChosen.id
        },
        function (err) {
            if (err) throw err;
            console.log("Added " + answer.roleAdd + " as a role.");
            mainPrompt();
        }
    )
    })
    })
} 

//function to add an employee
const employeeAdd = () => {
    connection.query("SELECT * FROM role", function (err, results){
        if (err) throw err;
        inquirer
            .prompt ([{
                name: `employeeAdd`,
                type: `input`,
                message: `Enter the first name of the employee you'd like to add.`,
            },

            {name: `last_name`,
            type: `input`,
            message: `What is the employee's last name?`
        },

        {name: `role_id`,
        type: `list`,
        message: `Select the role of this employee:`,
        choices: results.map(item => item.title)
        },
    ])

    .then ((answer) => {
        const roleChosen = results.find(item => item.title === answer.role_id)
        const employeeFirstName = answer.employeeAdd
        const employeeLastName = answer.last_name;
        connection.query("SELECT * FROM employee", function (err, results) {
            if (err) throw err; 
            inquirer
            .prompt ([{
                name:`manager_id`,
                type: `list`,
                message: `Select this employee's manager:`,
                choices: results.map(item => item.first_name)
            }
        ])
        .then ((answer) => {
            const managerChosen = results.find(item = item.first_name === answer.manager_id)

            connection.query(
                "INSERT INTO employee SET ?", {
                    first_name: employeeFirstName,
                    last_name: employeeLastName,
                    role_id: roleChosen.id,
                    manager_id: managerChosen.id
                },
                function(err) {
                    if (err) throw err;
                    console.log("Added " + employeeFirstName + " " + employeeLastName + " to the team!");
                    mainPrompt(); 
                }
            )
        })
        })
    })
})
}

//function to view all departments
const departmentView = () => {
    connection.query("SELET * FROM department", (err, res) => {
        if (err) throw err; 
        console.table(res)
        mainPrompt();
    })
}

//function to view all roles
const roleView = () => {
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        console.table(res)
        mainPrompt();    
    })
}

//function to view all employees
 const employeeView = () => {
     connection.query("SELET * FROM employee", (err, res) => {
         if (err) throw err; 
         console.table(res)
         mainPrompt();
     })
 }

//function to view a list of employees based on manager
const employeeManagerView = () => {
    connection.query("SELECT * FROM employee", function (err, results){
        if (err) throw err;
        inquirer
        .prompt([{
            name: `managersTeam`,
            type: `list`,
            message: `Please choose which manager's team you'd like to view:`,
            choices: results.map(item => item.first_name)
        },
    ])
    
    .then((answer) => {
        const managerName = results.find(item => item.first_name === answer.managersTeam)
        const managerID = managerName.id
        connection.query("SELECT * FROM employee WHERE manager_id = " + "'" + managerID + "'", (err, res) => {
            if (err) throw err;
            console.table(res)
            mainPrompt()
        })
    })
})
}

//function to view a department's budget
const departmentBudget = () => {
    connection.query("SELET * FROM department", function (err, results){
        if (err) throw err;
        inquirer
        .prompt([{
            name: `departmentBudget`,
            type: `list`,
            message: `Please select which department's budget you'd like to view:`,
            choices: results.map(item => item.name)
            },
        ])

        .then ((answer) => {
            const departmentBudget1 = results.find(item => item.name === answer.departmentBudget)
            const departmentBudget2 = departmentBudget1.id
            connection.query("SELET SUM(salary) as Total_Department_Budget FROM role WHERE department_id = " + "'" departmentBudget2 + "'", (err, res) => {
                if (err) throw err;
                console.table(res)
                mainPrompt()
            })
        })
    })
}

//function to update employee information
const employeeUpdate = () => {
    connection.query("SELET * FROM employee", function (err, results){
        if (err) throw err;
        inquirer
        .prompt ([{
            name: `employeeUpdate`,
            type: `list`,
            message: `Choose which employee whose role you'd like to update.`,
            choices: results.map (item => item.first_name)
        },
    ])

    .then((answer) => {
        const updateEmployee = (answer.employeeUpdate)
        connection.query("SELECT ( from role", function (err, results){
            if (err) throw err;
            inquirer
            .prompt ([{
                name: `role_id`,
                type: `list`,
                message: `Select the new role of the employee:`,
                choices: results.map(item => item.title)
            },
        ])

        .then ((answer) => {
            const roleChosen = results.find (item => item.title === answer.role_id)

            connection.query("UPDATE employee SET ? WHERE first_name = " + "'" + updateEmployee + "'", {
                role_id: "" + roleChosen.id + "",
            },
            function (err) {
                if (err) throw err; 
                console.log("Successfull updated " + updateEmployee + "'s role to " + answer.role_id + ".");
                mainPrompt();
            }
            )
        })
        })
    })
    })
}

//function to update an employee's manager
const employeeManagerUpdate = () => {
    connection.query("SELET * FROM employee", function (err, results){
        if (err) throw err;
        inquirer
        .prompt ([{
            name: `employeeUpdateManager`,
            type: `list`,
            message: `Please select the employee whose manager is being updated:`,
             choices: results.map( item => item.first_name)
        },
    ])

    .then((answer) => {
        const updateEmployeeManager = (answer.employeeUpdateManager)
        connection.query("SELET ( FROM employee", function (err, results){
            if (err) throw err;
            inquirer
            .prompt ([{
                name: `manager_id`,
                type: `list`,
                message: `Please select the new manager of the employee:`,
                choices: results.map (item => item.first_name)
            },
        ])
        
        .then((answer) => {
            const managerChosenUpdated = results.find (item => item.first_name === answer.manager_id)

            connection.query(
                "UPDATE employee SET ? WHERE first_name = " + "'" + updateEmployeeManager + "'", {
                    manager_id: "" + managerChosenUpdated.id + "",
                },
                function (err) {
                    if (err) throw err;
                    console.log ("Successfully updated " + updateEmployeeManager + " 's manager to" + " " + answer.manager_id + "!");
                    mainPrompt();
                }
            )
        })
        })
    })
    })
}

//function to remove a department
const departmentRemove = () {
    connection.query("SELECT * FROM department", function (err, results){
        if (err) throw err;
        inquirer
        .prompt ([{
            name: `departmentDeleteName`,
            type: `list`,
            message: `Please select the department you'd like to remove:`,
            choices: results.map (item => item.name)
        },
    ])

    .then ((answer) => {
        const departmentReomve1 = results.find (item => item.name === answer.departmentDeleteName)
        const departmentRemove2 = departmentReomve1.id
        connection.query("DELETE FROM department WHERE id = " + "'" + departmentRemove2 + "'",
        function (err) {
            if (err) throw err;
            console.log("Successfully removed " + answer.departmentDeleteName + " from the list of departments.");
            mainPrompt();
        }
        )
    })
    })
}

//function to remove a role
const roleRemove = () => {
    connection.query ("SELECT * FROM role", function (err, results) {
        if (err) throw err;
        inquirer
        .prompt([{
            name: `roleDeleteName`,
            type: `list`,
            message:`Please select which role you'd like to remove:`,
            choices: results.map (item => item.title)
        },
    ])

    .then ((answer) => {
        const roleRemove1 = results.find (item => item.title === answer.roleDeleteName)
        const roleRemove2 = roleRemove1.id 
        connection.query("DELETE FROM role WHERE id = " + "'" + roleRemove2 + "'",
        function (err){
            if (err) throw err;
            console.log("Successfully removed " + answer.roleDeleteName + " from the list of roles.")
            mainPrompt();
        })
    })
    })
}

//function to remove an employee
const employeeRemove = () {
    connection.query("SELECT * FROM employee", function (err, results) {
        if (err) throw err;
        inquirer
        .prompt ([{
            name: `employeeDeleteName`,
            type: `list`,
            message: `Please select the employee you'd like to remove:`,
            choices: results.map (item => item.first_name),
        },
    ]
    
    .then ((answer) => {
        const employeeRemove1 = results.find(item=> item.first_name === answer.employeeDeleteName)
        const employeeRemove2 = employeeRemove1.id
        connection.query("DELETE FROM employee WHERE id = " + "'" + employeeRemove2 + "'",
        function (err) {
            if (err) throw err;
            console.log("Successfully removed " + answer.employeeDeleteName + " from the database.");
            mainPrompt();
        }
        )
    })
    })
}
