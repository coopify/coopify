import * as pug from 'pug'
import { sendgrid, logger } from '../services'
import { sendgrid as emailConfigs } from '../../../config'

export async function proposalStatusChangedEmail(params: { email: string, name: string, status: string }) {
    try {
        const homelink = emailConfigs.apikey !== 'a' ? '' : ''
        const emailTemplatePath = `${__dirname}/bodys/proposalStatus.pug`
        const render = pug.renderFile(emailTemplatePath, {
            status: params.status,
            serviceName: 'Test service',
            paymentMethod: 'Payment method',
        })
        await sendgrid.sendEmail({
            from: 'coopify@develop.com',
            to: params.email,
            html: render,
            subject: `Your proposal was ${params.status}`,
            text: 'Coopify',
        })
        logger.info(`MAILER => Sent proposal status changed email to ${params.email}`)
    } catch (error) {
        logger.info(`MAILER => Failed with error ${JSON.stringify(error)}`)
    }
}
