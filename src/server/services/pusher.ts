import * as Pusher from 'pusher'
import { logger } from '../services'
import { server as config } from '../../../config'

export interface IMessageFields {
    to: any,
    from: any,
    text: string,
    conversationId: string,
    authorId: string,
}

interface IOptions {
    appId: string,
    key: string,
    secret: string,
    cluster: string,
    useTLS: boolean,
}

export class PusherService {
    private pusher: Pusher
    private isConnected: boolean

    constructor(options: IOptions) {
        this.isConnected = false
        this.pusher = new Pusher(options)
        logger.info('Pusher => Connected')
    }

    public async sendMessageAsync(message: IMessageFields) {
        if (config.environment === 'test') { return }
        logger.info(`Sending message ${message.text} from ${message.from.email} to ${message.to.email}`)
        return this.pusher.trigger(message.to.id, 'message', message)
    }
}
