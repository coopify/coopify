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
    private pusherClient: PusherClient
    private isConnected: boolean

    constructor(options: IOptions) {
        this.isConnected = false
        this.pusher = new Pusher(options)
        this.pusherClient = new PusherClient(options.key, { cluster: options.cluster });
        logger.info('Pusher => Connected')
        this.createChannel();
    }

    private createChannel() {
        let channel = this.pusherClient.subscribe("TransactionResponse");

        channel.bind('success', (data) => {
            const status = "Confirmed";
            this.updateProposal(data, status);
        });

        channel.bind('failure', (data) => {
            const status = "PaymentFailed";
            this.updateProposal(data, status);
        });
    }

    private async updateProposal(data, status) {
        console.log("entro al pusher y esta en el update");
        const proposal = await getAsync(data.proposalId);

        if (proposal != null) {
            proposal.status = status;
            const updatedProposal = await updateAsync(proposal, proposal);

            const conversation = await getConversation(proposal.conversationId);
            const userA = conversation.from;
            const userB = conversation.to;

            proposalStatusChangedEmail({email: userA.email, name: userA.name, status: status});
            proposalStatusChangedEmail({email: userB.email, name: userB.name, status: status});

            this.pusher.trigger(userA.id, 'notifyStatus', {status: status});
            this.pusher.trigger(userB.id, 'notifyStatus', {status: status});
        }
    }

    public async sendMessageAsync(message: IMessageFields) {
        if (config.environment === 'test') { return }
        logger.info(`Sending message ${message.text} from ${message.from.email} to ${message.to.email}`)
        return this.pusher.trigger(message.to.id, 'message', message)
    }
}
