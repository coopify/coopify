'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('OfferCategory', 'createdAt', Sequelize.DATE).then(() => {
            queryInterface.addColumn('OfferCategory', 'updatedAt', Sequelize.DATE)
        })
    },

    down: (queryInterface) => {
        return queryInterface.removeColumn('OfferCategory', 'createdAt').then(() => { queryInterface.removeColumn('OfferCategory', 'updatedAt') })
    }
}
