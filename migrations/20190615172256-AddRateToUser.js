'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('User', 'rateCount', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        }).then(() => queryInterface.addColumn('User', 'rateSum', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        }))
    },

    down: (queryInterface) => {
        return queryInterface.removeColumn('User', 'rateCount').then(() => queryInterface.removeColumn('User', 'rateSum'))
    }
}
