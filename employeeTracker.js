const mysql = require('mysql2');
const inquirer = require('inquirer');

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