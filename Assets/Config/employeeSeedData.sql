DROP DATABASE IF EXISTS  employeeTracker_db;

CREATE DATABASE employeeTracker_db;

USE employeeTracker_db;

CREATE TABLE department (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name VARCHAR(30)
);
CREATE TABLE role (
    id INT  NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    department_id  INT NOT NULL
);
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NULL
);

INSERT INTO department (name)
VALUES
("Sales"),
("Service"),
("Marketing"),
("Human Resources"),
("Accounting");

INSERT INTO role (title, salary, department_id)
VALUES
("Manager", 100000, 1),
("Assistant Manager", 90000, 2),
("Team Lead", 85000, 3),
("Applications Engineer", 55000, 4),
("Inside Sales Representative", 45000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
("Shawn", "Spencer", 1, 1),
("Burton", "Guster", 2, null),
("Ghee", "Buttersnaps", 3, 3),
("Lavender", "Gooms", 4, null),
("Gus T.T.", "Showbiz", 5, 5);