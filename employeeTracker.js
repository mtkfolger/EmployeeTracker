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
    whatWouldYouLike();
});