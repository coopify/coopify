'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('Category', 'createdAt', Sequelize.DATE).then(() => {
            queryInterface.addColumn('Category', 'updatedAt', Sequelize.DATE)
        })
    },

    down: (queryInterface) => {
        return queryInterface.removeColumn('Category', 'createdAt').then(() => { queryInterface.removeColumn('Category', 'updatedAt') })
    }
}
