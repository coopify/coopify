'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('Goal', 'code', {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'default'
        }).then(() => {
              queryInterface.addColumn('UserGoal', 'code', {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'default'
            })
        })
    },

    down: (queryInterface) => {
        return queryInterface.removeColumn('Goal', 'code').then(() => queryInterface.removeColumn('UserGoal', 'code'))
    }
}
