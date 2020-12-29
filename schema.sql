DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
id int AUTO_INCREMENT PRIMARY KEY,
dept_name VARCHAR(30)
);

CREATE TABLE person_role (
id int AUTO_INCREMENT KEY,
title VARCHAR(30) NOT NULL,
salary DECIMAL,
department_id INT
);

CREATE TABLE employee (
id int AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT,
manager_id INT
);

SELECT * FROM employee;
SELECT * FROM department;