'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('OfferPrice', 'createdAt', Sequelize.DATE).then(() => {
            queryInterface.addColumn('OfferPrice', 'updatedAt', Sequelize.DATE)
        })
    },

    down: (queryInterface) => {
        return queryInterface.removeColumn('OfferPrice', 'createdAt').then(() => { queryInterface.removeColumn('OfferPrice', 'updatedAt') })
    }
}
