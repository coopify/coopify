'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('User', 'lastName', Sequelize.STRING).then(() => {
      queryInterface.addColumn('User', 'birthdate', Sequelize.DATE).then(() => {
        queryInterface.addColumn('User', 'bio', Sequelize.TEXT).then(() => {
          queryInterface.addColumn('User', 'gender', Sequelize.STRING).then(() => {
            queryInterface.addColumn('User', 'address', Sequelize.STRING)
          })
        })
      })
    })
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('User', 'lastName').then(() => {
      queryInterface.removeColumn('User', 'birthdate').then(() => {
        queryInterface.removeColumn('User', 'bio').then(() => {
          queryInterface.removeColumn('User', 'gender').then(() => {
            queryInterface.removeColumn('User', 'address')
          })
        })
      })
    })
  }
};
