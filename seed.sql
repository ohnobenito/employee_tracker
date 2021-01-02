USE employee_db;

INSERT INTO department (dept_name) VALUES ('Marketing');
INSERT INTO department (dept_name) VALUES ('Sales');
INSERT INTO department (dept_name) VALUES ('Warehouse');
INSERT INTO department (dept_name) VALUES ('Web');

INSERT INTO person_role (title, salary, department_id) VALUES ('Marketing Manager', 100000, 1);
INSERT INTO person_role (title, salary, department_id) VALUES ('Marketing Sales', 50000, 1);
INSERT INTO person_role (title, salary, department_id) VALUES ('Sales Manager', 100000, 2);
INSERT INTO person_role (title, salary, department_id) VALUES ('Sales Associate', 30000, 2);
INSERT INTO person_role (title, salary, department_id) VALUES ('Warehouse Manager', 100000, 3);
INSERT INTO person_role (title, salary, department_id) VALUES ('Warehouse Associate', 30000, 3);
INSERT INTO person_role (title, salary, department_id) VALUES ('Web Manager', 200000, 4);
INSERT INTO person_role (title, salary, department_id) VALUES ('Web Designer', 100000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Homer', 'Simpson', 1, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Marge', 'Simpson', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Bart', 'Simpson', 2, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Linda', 'Belcher', 3, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Tina', 'Belcher', 4, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Gene', 'Belcher', 4, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Lisa', 'Simpson', 5, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Scooby', 'Doo', 6, 7);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Louise', 'Belcher', 8, 7);

SELECT * FROM employee;
