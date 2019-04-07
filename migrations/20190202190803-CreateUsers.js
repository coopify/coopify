'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('User', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            pictureURL: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            resetToken: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            isVerified: {
                type: Sequelize.BOOLEAN,
                default: false
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
        return queryInterface.dropTable('User')
    }
}
