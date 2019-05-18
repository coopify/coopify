'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Goal', {
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
            goalId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'Goal',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            goalProgress: {
                type: Sequelize.INTEGER,
                allowNull: false,
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
        return queryInterface.dropTable('Goal');
    }
};
