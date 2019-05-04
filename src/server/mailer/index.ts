import * as pug from 'pug'
import { sendgrid, logger } from '../services'
import { sendgrid as emailConfigs } from '../../../config'

export async function proposalStatusChangedEmail(params: { email: string, name: string, state: string }) {
    try {
        const homelink = emailConfigs.apikey !== 'a' ? '' : ''
        const emailTemplatePath = `${__dirname}/bodys/proposalStatus.pug`
        const render = pug.renderFile(emailTemplatePath, { userFirstName: params.name, homelink } )
        const mail = await sendgrid.sendEmail({
                        from: 'coopify@develop.com',
                        to: params.email,
                        html: render,
                        subject: `Your proposal was ${params.state}`,
                        text: '',
                    })
        logger.info(`MAILER => Sent proposal status changed email to ${params.email}`)
    } catch (error) {
        logger.info(`MAILER => Failed with error ${JSON.stringify(error)}`)
    }
}
