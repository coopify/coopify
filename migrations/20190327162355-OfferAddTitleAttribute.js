'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Offer', 'title', Sequelize.TEXT)
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn('Offer', 'title')
  }
};
