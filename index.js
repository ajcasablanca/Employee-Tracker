const { prompt } = require('inquirer');
const db = require("./db")

init();

function init() {
    loadPrompts();
}

function loadPrompts() {
    prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices:
                [
                    {
                        name: "View All Employees",
                        value: "view_all_employees"

                    },
                    
                    {
                        name: "Add Employee",
                        value: "add_employee"
                    },
                   
                    {
                        name: "Update Employee Role",
                        value: "update_employee_role"
                    },
                    
                    {
                        name: "View All Departments",
                        value: "view_all_departments"
                    },
                    {
                        name: "Add Department",
                        value: "add_department"
                    },
                    
                    {
                        name: "View All Roles",
                        value: "view_all_roles"
                    },
                    {
                        name: "Add Role",
                        value: "add_role"
                    },
                    
                    {
                        name: "Quit",
                        value: "quit"
                    },
                ],
            name: "userChoice"
        }
    ])
        .then(answers => {
            let choice = answers.userChoice;

            switch (choice) {
                case "view_all_employees":
                    viewAllEmployees();
                    break;

                case "add_employee":
                    addEmployee();
                    break;

                case "update_employee_role":
                    updateEmployeeRole();
                    break;

                case "view_all_departments":
                    viewAllDepartments();
                    break;
                case "add_department":
                    addDepartment();
                    break;

                case "view_all_roles":
                    viewAllRoles();
                    break;
                case "add_role":
                    addRole();
                    break;

                case "quit":
                    quit();
                    break;
                default:
                    quit();
            }
        })
}

function viewAllEmployees() {
    db.findAllEmployees()
        .then(([rows]) => {
            let employees = rows;
            console.log("\n");
            console.table(employees);
            loadPrompts();
        })

}



function addEmployee() {

    prompt([
        {
            name: "first_name",
            message: "What is the employee's first name"
        },
        {
            name: "last_name",
            message: "What's the employee's last name"
        }
    ])
        .then(res => {
            let first_Name = res.first_name;
            let last_Name = res.last_name;

            db.showAllRoles()
                .then(([rows]) => {
                    let roles = rows;
                    const roleOptions = roles.map(({ id, title }) => ({
                        name: title,
                        value: id
                    }));

                    prompt({
                        type: "list",
                        name: "role_id",
                        message: "What is the employee's role?",
                        choices: roleOptions
                    })
                        .then(res => {
                            let role_id = res.role_id;

                            db.findAllEmployees()
                                .then(([rows]) => {
                                    let employees = rows;
                                    const managerChoices = employees.map(({ id, first_name, last_name }) => ({
                                        name: `${first_name} ${last_name}`,
                                        value: id
                                    }));

                                    managerChoices.unshift({ name: "None", value: null });

                                    prompt({
                                        type: "list",
                                        name: "manager_id",
                                        message: "Who is the employee's manager?",
                                        choices: managerChoices
                                    })
                                        .then(res => {
                                            let employee = {
                                                manager_id: res.manager_id,
                                                role_id: role_id,
                                                first_name: first_Name,
                                                last_name: last_Name
                                            }

                                            return db.addEmployee(employee);
                                        })
                                        .then(() => {
                                            console.log(
                                                `Successfully added ${first_Name} ${last_Name}!`
                                            )
                                            loadPrompts()
                                        }

                                        )

                                })
                        })
                })
        })
}



function updateEmployeeRole() {
    db.findAllEmployees()
        .then(([rows]) => {
            let employees = rows;
            const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));


            prompt([
                {
                    type: "list",
                    name: "employee_id",
                    message: "Which employee would you like to update?",
                    choices: employeeChoices
                }
            ])
                .then(res => {
                    let employee_id = res.employee_id;
                    db.showAllRoles()
                        .then(([rows]) => {
                            let roles = rows;
                            const roleChoices = roles.map(({ id, title }) => ({
                                name: title,
                                value: id
                            }));


                            prompt([
                                {
                                    type: "list",
                                    name: "role_id",
                                    message: "What is the employees new role?",
                                    choices: roleChoices
                                }
                            ])
                                .then(res => db.updateEmployeeRole(employee_id, res.role_id))
                                .then(() => {
                                    console.log("Successfully updated employee's role!")
                                    loadPrompts()
                                }

                                )
                        });
                });
        })
}


function viewAllDepartments() {
    db.showAllDepartments()
        .then(([rows]) => {
            let departments = rows;
            console.log("\n");
            console.table(departments);
            loadPrompts();
        })

}

function addDepartment() {
    prompt([
        {
            name: "name",
            message: "What is the name of the department?"
        }
    ])
        .then(res => {
            let name = res;
            db.addDepartments(name)
                .then(() => {
                    console.log(`Successfully added ${name.names} to the database`)
                    loadPrompts();
                })

        })
}



function viewAllRoles() {
    db.showAllRoles()
        .then(([rows]) => {
            let roles = rows;
            console.log("\n");
            console.table(roles);
            loadPrompts();
        })

}

function addRole() {
    db.showAllDepartments()
        .then(([rows]) => {
            let departments = rows;
            const departmentChoices = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }

            )

            );
            // console.log(departmentChoices);
            prompt([
                {
                    name: "title",
                    message: "What is the name of the role?"
                },
                {
                    name: "salary",
                    message: "What is the salary rate?"
                },
                {
                    type: "list",
                    name: "department_id",
                    message: "Which department is the role under",
                    choices: departmentChoices
                }
            ])
                .then(role => {
                    db.addRole(role)
                        .then(() => {
                            console.log(`Added ${role.titles} to the database`)
                            loadPrompts();
                        })
                })

        })
}



function quit() {
    process.exit();
}