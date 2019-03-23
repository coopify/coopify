'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

    return queryInterface.createTable('Bid', {
      id : {
        type: Sequelize.UUID,
        primaryKey : true
      },
      userId : {
        type : Sequelize.UUID,
        allowNull : false,
        references : {
            model : 'User',
            key : 'id'
        },
        onUpdate : 'cascade',
        onDelete : 'cascade'
      },
      description : {
        type : Sequelize.STRING,
        allowNull : true,
      },
      images : {
        type : Sequelize.JSONB,
        allowNull : false
      },
      category : {
        type : Sequelize.TEXT,
        allowNull : true
      },
      paymentMethod : {
        type : Sequelize.STRING,
        allowNull : false
      },
      startDate : {
        type : Sequelize.DATE,
        allowNull : false
      },
      finishDate : {
        type : Sequelize.DATE,
        allowNull : false
      },
      status : {
        type : Sequelize.TEXT,
        allowNull : false
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */

   return queryInterface.dropTable('Bid')
  }
};
