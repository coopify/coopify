'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('Offer', 'rateCount', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        }).then(() => queryInterface.addColumn('Offer', 'rateSum', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        }))
    },

    down: (queryInterface) => {
        return queryInterface.removeColumn('Offer', 'rateCount').then(() => queryInterface.removeColumn('Offer', 'rateSum'))
    }
}
