import { google } from 'googleapis'
import { logger } from './wLogger'

export interface IOptions {
    clientId: string
    apiKey: string
    redirectURI: string  
}

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
                options.redirectURI,
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
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
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
            const response = await this.authenticator.getToken(code)
            
            return response.tokens
        } catch (error) {
            logger.error(`ERROR => ${error}`) 
        }
    }

    public async getUserData(authToken: string, refreshToken: string): Promise<{ email: string, name: string }> {
        try {
            this.authenticator.setCredentials({
                refresh_token: refreshToken,
                access_token: authToken,
            })
            const info = await google.people("v1").people.get({ 
                resourceName: 'people/me',
                auth: this.authenticator,
                personFields: 'names,emailAddresses'
            })
            return this.processResponse(info)
        } catch (error) {
            logger.error(`ERROR => ${error}`)
            throw error
        }
    }

    private processResponse(info: any): { email: string, name: string } {
        const name = info.data.names[0].displayname
        const email = info.data.emailAddresses[0].value
        return { email, name }
    }
}

export const googleAuth: GoogleAuthentication = new GoogleAuthentication()