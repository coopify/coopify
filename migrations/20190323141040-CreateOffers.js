'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Offer', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'User',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            description: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            images: {
                type: Sequelize.JSONB,
                allowNull: false
            },
            category: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            paymentMethod: {
                type: Sequelize.STRING,
                allowNull: false
            },
            startDate: {
                type: Sequelize.DATE,
                allowNull: false
            },
            finishDate: {
                type: Sequelize.DATE,
                allowNull: true
            },
            status: {
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
        return queryInterface.dropTable('Offer')
    }
}
