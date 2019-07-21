'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.changeColumn('User', 'password', {
            type: Sequelize.STRING,
            allowNull : true,
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.changeColumn('User', 'password', {
            type: Sequelize.STRING,
            allowNull : false,
        })
    }
}
