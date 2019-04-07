'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('Offer', 'category')
    },

    down: (queryInterface) => {
        return queryInterface.addColumn('Offer', 'category')
    }
};