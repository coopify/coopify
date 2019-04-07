import * as sendgridLib from '@sendgrid/mail'
import { logger } from '../services'
import { server as config } from '../../../config'

export interface IMessageFields {
    to: string,
    from: string,
    subject: string,
    text: string,
    html: string,
}

class Sendgrid {
    public isConnected: boolean

    constructor() {
        this.isConnected = false
    }

    public async initAsync(sendgridApiKey: string) {
        try {
            sendgridLib.setApiKey(sendgridApiKey)
            this.isConnected = true
            logger.info('Sendgrid => Connected')

        } catch (error) {
            logger.error(`Sendgrid => ${JSON.stringify(error)}`)
        }
    }

    public async sendEmail(message: IMessageFields) {
        if (config.environment === 'test') { return }
        return sendgridLib.send(message)
    }
}

export const sendgrid: Sendgrid = new Sendgrid()
