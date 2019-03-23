import { logger } from '../services'
import { server as config } from '../../../config'
import * as rp from 'request-promise'

export interface IOptions {
    route: string
    port: string
}

export class Blockchain {
    public isConnected: boolean
    private options: IOptions

    constructor(options: IOptions) {
        this.isConnected = false
        this.options = options
    }

    public signUp(userId: string): void {
        //We dont wait for this cause it has to make some transactions on a Blockchain Network and that does not happen quickly
        rp({
            uri: `${this.options.route}:${this.options.port}/api/users/signup`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: { userId },
            json: true,
        }).then(() => { logger.info(`Finished the sigup process for the user ${userId}`) }).catch((err) => {
            logger.error(`Failed on the signup process for the user ${userId} - ${JSON.stringify(err)}`)
        })
    }

    public async getBalanceAsync(userId: string): Promise<{ balance: number }> {
        //We dont wait for this cause it has to make some transactions on a Blockchain Network and that does not happen quickly
        //TODO: Mock this calls so we can test what depends on this nock (https://github.com/nock/nock)
        const balance = await rp({
            uri: `${this.options.route}:${this.options.port}/api/users/${userId}/balance`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            json: true,
        }).then((res) => {
            logger.info(`Obtained the balance of the user ${userId}`)
            return res
        }).catch((err) => {
            logger.error(`Failed to obtain the balance of the user  ${userId} - ${JSON.stringify(err)}`)
        })
        return balance
    }

    public async getTransactionsAsync(userId: string): Promise<any> {
        //We dont wait for this cause it has to make some transactions on a Blockchain Network and that does not happen quickly
        //TODO: Mock this calls so we can test what depends on this nock (https://github.com/nock/nock)
        const transactions = await rp({
            uri: `${this.options.route}:${this.options.port}/api/users/${userId}/transactions`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            json: true,
        }).then((res) => {
            logger.info(`Obtained the transactions of the user ${userId}`)
            return res
        }).catch((err) => {
            logger.error(`Failed to obtain the transactions of the user  ${userId} - ${JSON.stringify(err)}`)
        })
        logger.info(`TRANSACTIONS => ${transactions} ${JSON.stringify(transactions)}`)
        return transactions
    }
}
