'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Rate', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true
            },
            description: {
                type: Sequelize.STRING,
                allowNull: false
            },
            rate: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            offerId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'Offer',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            proposalId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'Proposal',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            reviewedUserId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'User',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            reviewerUserId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'User',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
            }
        })
    },

    down: (queryInterface) => {
        return queryInterface.dropTable('Rate')
    }
}
