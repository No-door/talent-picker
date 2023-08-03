const employeeJson = require('./employee.json').candidates;

class EmployeeRepository {
    findAll() {
        console.log(employeeJson)
        return employeeJson;
    }

    employeesToBlocks(employees) {
        const rows = employees.map(candidate => ({
            type: 'mrkdwn',
            text: `*${candidate.name}*\n${candidate.level}\n${candidate.location}`,
        }));

        return {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: 'List of Candidates for Interview',
            },
            accessory: {
                type: 'table',
                columns: [
                    {
                        type: 'plain_text',
                        text: 'Name',
                    },
                    {
                        type: 'plain_text',
                        text: 'Level',
                    },
                    {
                        type: 'plain_text',
                        text: 'Localtion',
                    },
                ],
                rows: rows,
            },
        };
    }
}

module.exports = new EmployeeRepository();