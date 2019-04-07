'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Category', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            deleted: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            }
        })
    },

    down: (queryInterface) => {
        return queryInterface.dropTable('Category');
    }
};