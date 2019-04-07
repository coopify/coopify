'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('User','googleAccessToken',{
            type: Sequelize.STRING,
            allowNull: true
        }).then(() => queryInterface.addColumn('User', 'googleRefreshToken', {
            type: Sequelize.STRING,
            allowNull: true
        }).then(() => queryInterface.addColumn('User', 'name', {
            type: Sequelize.STRING,
            allowNull: true
        })))
    },

    down: (queryInterface) => {
        return queryInterface.removeColumn('User', 'googleAccessToken').then(() =>
            queryInterface.removeColumn('User', 'googleRefreshToken').then(() => 
                queryInterface.removeColumn('User', 'name')))
    }
}
