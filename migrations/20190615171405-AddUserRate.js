'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('Rate', 'userRate', {
            type: Sequelize.INTEGER,
            allowNull: false,
        }).then(() => queryInterface.renameColumn('Rate', 'rate', 'offerRate'))
    },

    down: (queryInterface) => {
        return queryInterface.removeColumn('Rate', 'userRate').then(() => queryInterface.removeColumn('Rate', 'offerRate', 'rate'))
    }
}
