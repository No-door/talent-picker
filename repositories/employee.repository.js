const employeeJson = require('./employee.json').candidates;

class EmployeeRepository {
    findAll() {
        return employeeJson;
    }

    employeesToBlockItems(employees) {
        return employees.map((employee, index) => {
            return {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `<${employee.cv}|${employee.name}>\n${employee.email}\nLevel: ${employee.level}, FTE: ${employee.FTE}`
                },
                "accessory": {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "emoji": true,
                        "text": "Choose"
                    },
                    "action_id": "choose_employee",
                    "value": employee.id + "",
                }
            }
        })
    }

    employeesToList(employees) {
        return employees.map((employee, index) => {
            return `• <${employee.cv}|${employee.name}>`
        }).join('\n');
    }
}

module.exports = EmployeeRepository;