const employeeJson = require('./employee.json').candidates;

class EmployeeRepository {
    findAll() {
        return employeeJson;
    }

    employeesToBlocks(employees) {
        const employeeTinyBlocks = employees.map(employee => {
            const value = `Level: ${employee.level} \n FTE: ${employee.FTE}\n...`
            return {
                "title" : `${employee.name}`,
                "value" : value
            }
        })

        return [{
            "fields": employeeTinyBlocks,
        }];
    }

    employeesToList(employees) {
        return employees.map((employee, index) => {
            return `• <https://google.com|${employee.name}>`
        }).join('\n');
    }
}

module.exports = EmployeeRepository;