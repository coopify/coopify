'use strict'
const randomString = require('random-string')

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('User', 'referalCode', {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: randomString(8)
        })
    },

    down: (queryInterface) => {
        return queryInterface.removeColumn('User', 'referalCode')
    }
}
