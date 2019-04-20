'use strict'

module.exports = {
    up: (queryInterface) => {
        return queryInterface.dropTable('OfferPrice')
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.createTable('OfferPrice', {
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
            selected: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            frequency: {
                type: Sequelize.STRING,
                allowNull: false
            },
            price: {
                type: Sequelize.INTEGER,
                allowNull: false
            }
        })
    }
}
