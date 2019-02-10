import { google } from 'googleapis'
import { logger } from './wLogger'
import { seqModels } from '../models'

export interface IOptions {
    clientId: string
    apiKey: string
    redirectURI: string  
}

/*
    This class was created to work with Sequelize as ORM, you can find more information
    regarding Sequelize here:
        http://docs.sequelizejs.com

    TODO: find documentation for Typescript
*/
class GoogleAuthentication {
    public authenticator
    public isConnected: boolean

    constructor(){
        this.isConnected = false
    }

    public async initAsync(options: IOptions) {
        try {
            
            this.authenticator = new google.auth.OAuth2(
                options.clientId,
                options.apiKey,
                options.redirectURI
            )
            this.isConnected = true
        } catch (error) {
            logger.error(`GoogleAuthenticator => ${error}`)
        }
    }
    
    /**
     * method to generate the url in google
     */
    public generateAuthURI(): string {
        // generate a url that asks permissions for Blogger and Google Calendar scopes
        const scopes = [
            'https://www.googleapis.com/auth/plus.login',
            'https://www.googleapis.com/auth/plus.me',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'
        ]
        const url = this.authenticator.generateAuthUrl({
            // 'online' (default) or 'offline' (gets refresh_token)
            access_type: 'offline',

            // If you only need one scope you can pass it as a string
            scope: scopes
        })
        return url      
    }

    /**
     * method to exchange code by token
     */
    public async ExchangeCodeForToken(code: string) {
        // This will provide an object with the access_token and refresh_token.
        // Save these somewhere safe so they can be used at a later time.
        try {
            const {tokens} = await this.authenticator.getToken(code)
            this.authenticator.setCredentials(tokens)
            const info = await google.plus('v1').people.get({ userId: 'id' })
            logger.info(`INFO = ${JSON.stringify(info)}`)
        return tokens
        } catch (error) {
            logger.error(`INFO = ${JSON.stringify(error)} / ${error}`) 
        }
        
    }

    // public async GetData(tokens){
    //     this.authenticator.
    // }
}

export const googleAuth: GoogleAuthentication = new GoogleAuthentication()