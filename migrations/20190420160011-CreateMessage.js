'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Message', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true
            },
            conversationId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'Conversation',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            authorId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'User',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            text: {
                type: Sequelize.TEXT,
                allowNull: false
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
        return queryInterface.dropTable('Message')
    }
}
