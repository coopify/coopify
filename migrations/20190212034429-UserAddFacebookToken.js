'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('User', 'FBAccessToken', Sequelize.STRING).then(() => queryInterface.addColumn('User', 'FBRefreshToken', Sequelize.STRING))
    },

    down: (queryInterface) => {
        return queryInterface.removeColumn('User', 'FBAccessToken').then(() => queryInterface.removeColumn('User', 'FBRefreshToken'))
    }
}
