'use strict'

module.exports = {
    up: (queryInterface) => {
        return queryInterface.renameColumn('Proposal', 'offererId', 'proposerId')
    },

    down: (queryInterface) => {
        return queryInterface.renameColumn('Proposal', 'proposerId', 'offererId')
    }
}
