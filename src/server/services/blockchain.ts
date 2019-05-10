import { logger } from '../services'
import * as rp from 'request-promise'
import { User, Offer, Proposal } from '../models'
import { ErrorPayload } from '../errorPayload'

export interface IOptions {
    route: string
    port: string
}

export interface ITransfer {
    from: User
    to: User
    offer: Offer
    proposal: Proposal
    amount: number
}

export interface ITransaction {
    date: string,
    coopies: number,
    from: string,
    to: string,
    inOut: string,
    description: string,
    proposalId: string,
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
                'Content-Type': 'application/json',
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
                'Content-Type': 'application/json',
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

    public async getTransactionsAsync(userId: string): Promise<ITransaction[] | null> {
        //We dont wait for this cause it has to make some transactions on a Blockchain Network and that does not happen quickly
        //TODO: Mock this calls so we can test what depends on this nock (https://github.com/nock/nock)
        const transactions: ITransaction[] | null = await rp({
            uri: `${this.options.route}:${this.options.port}/api/users/${userId}/transactions`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            json: true,
        }).then((res) => {
            logger.info(`Obtained the transactions of the user ${userId}`)
            return res
        }).catch((err) => {
            logger.error(`Failed to obtain the transactions of the user  ${userId} - ${JSON.stringify(err)}`)
        })
        return transactions
    }

    public transfer(body: ITransfer) {
        const uri = `${this.options.route}:${this.options.port}/api/users/pay`
        return rp({
            uri,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body,
            json: true,
        }).then((res) => {
            logger.info(`User: ${body.from.email} paid user: ${body.to} ${body.amount} for the service ${body.offer.title}`)
            return res
        }).catch((err) => {
            const message = `Failed to make a payment`
            throw new ErrorPayload(500, message, err)
        })
    }
}
