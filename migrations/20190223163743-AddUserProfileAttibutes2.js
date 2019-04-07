'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('User', 'phone', Sequelize.STRING).then(() => { queryInterface.addColumn('User', 'interests', Sequelize.JSONB) })
    },

    down: (queryInterface) => {
        return queryInterface.removeColumn('User', 'phone').then(() => { queryInterface.removeColumn('User', 'interests') })
    }
}
