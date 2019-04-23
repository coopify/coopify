'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Proposal', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true
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
            exchangeMethod: { //Coopy or Exchange
                type: Sequelize.STRING,
                allowNull: false
            },
            exchangeInstance: { //Hour, Session or Final Product
                type: Sequelize.STRING,
                allowNull: true
            },
            proposedPrice: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            proposedServiceId: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'Offer',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            status: {
                type: Sequelize.STRING,
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
        return queryInterface.dropTable('Proposal')
    }
}
