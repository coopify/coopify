import * as Pusher from 'pusher'
import * as PusherClient from 'pusher-js'
import { logger } from '../services'
import { server as config } from '../../../config'
import { getAsync, updateAsync } from '../interfaces/proposal'
import { getAsync as getConversation } from '../interfaces/conversation'
import { proposalStatusChangedEmail } from '../mailer'

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
    private channel: PusherClient.Channel

    constructor(options: IOptions) {
        this.isConnected = false
        this.pusher = new Pusher(options)
        const pusherClient = new PusherClient(options.key, { cluster: options.cluster })
        this.channel = pusherClient.subscribe('TransactionResponse')
        this.createChannel()
        logger.info('Pusher => Connected')
    }

    public async sendMessageAsync(message: IMessageFields) {
        if (config.environment === 'test') { return }
        logger.info(`Sending message ${message.text} from ${message.from.email} to ${message.to.email}`)
        return this.pusher.trigger(message.to.id, 'message', message)
    }

    private createChannel() {
        this.channel.bind('success', (data) => {
            logger.info(`Transaction confirmed`)
            const status = 'Confirmed'
            this.updateProposal(data, status)
        })
        this.channel.bind('failure', (data) => {
            logger.info(`Transaction failed`)
            const status = 'PaymentFailed'
            this.updateProposal(data, status)
        })
    }

    private async updateProposal(data, status) {
        const proposal = await getAsync(data.proposalId)

        if (proposal != null) {
            proposal.status = status
            await updateAsync(proposal, proposal)

            const conversation = await getConversation(proposal.conversationId)
            const userA = conversation.from
            const userB = conversation.to

            proposalStatusChangedEmail({ email: userA.email, name: userA.name, status })
            proposalStatusChangedEmail({ email: userB.email, name: userB.name, status })

            this.pusher.trigger(userA.id, 'notifyStatus', { status })
            this.pusher.trigger(userB.id, 'notifyStatus', { status })
        }
    }

}
