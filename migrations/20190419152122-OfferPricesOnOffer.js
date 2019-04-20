'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('Offer', 'hourPrice', Sequelize.INTEGER).then(() => {
            queryInterface.addColumn('Offer', 'sessionPrice', Sequelize.INTEGER).then(() => {
                queryInterface.addColumn('Offer', 'finalProductPrice', Sequelize.INTEGER).then(() => {
                    queryInterface.addColumn('Offer', 'exchangeInstances', {
                        type: Sequelize.ARRAY(Sequelize.STRING),
                        defaultValue: [],
                    })
                })
            })
        })
    },

    down: (queryInterface) => {
        return queryInterface.removeColumn('Offer', 'hourPrice').then(() => {
            queryInterface.removeColumn('Offer', 'sessionPrice').then(() => {
                queryInterface.removeColumn('Offer', 'finalProductPrice').then(() => {
                    queryInterface.removeColumn('Offer', 'exchangeInstances')
                })
            })
        })
    }
}
