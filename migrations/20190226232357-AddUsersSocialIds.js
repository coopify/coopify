'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('User', 'googleId', Sequelize.STRING).then(() => { queryInterface.addColumn('User', 'FBId', Sequelize.STRING) })
    },

    down: (queryInterface) => {
        return queryInterface.removeColumn('User', 'googleId').then(() => { queryInterface.removeColumn('User', 'FBId') })
    }
}
