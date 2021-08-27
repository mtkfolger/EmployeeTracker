//Creating the functions for various prompts

const inquirer = require("inquirer")

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
roleAdd()

//function to add an employee
employeeAdd()

//function to view all departments
departmentView()

//function to view all roles
roleView()

//function to view all employees
employeeView()

//function to view a list of employees based on manager
employeeManagerView()

//function to view a department's budget
departmentBudget()

//function to update employee information
employeeUpdate()

//function to update an employee's manager
employeeManagerUpdate()

//function to remove a department
departmentRemove()

//function to remove a role
roleRemove()

//function to remove an employee
employeeRemove()

