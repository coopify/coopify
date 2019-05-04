'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('Proposal', 'offererId', {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id'
            },
            onUpdate: 'cascade',
            onDelete: 'cascade'
        })
    },

    down: (queryInterface) => {
        return queryInterface.removeColumn('Proposal', 'offererId')
    }
}
