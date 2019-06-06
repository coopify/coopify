'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('OfferCategory', {
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
            categoryId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'Category',
                    key: 'id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
        })
    },

    down: (queryInterface) => {
        return queryInterface.dropTable('OfferCategory')
    }
}