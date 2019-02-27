import { google } from 'googleapis'
import { logger } from '../services'
import * as moment from 'moment'

export interface IOptions {
    clientId: string
    apiKey: string
    redirectURI: string  
}

export interface IUserData {
    email: string,
    pictureURL: string,
    googleId: string,
    name: string
    lastName: string,
    birthdate: Date,
    gender: string,
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
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/user.birthday.read'
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

    public async getUserData(authToken: string, refreshToken: string): Promise<IUserData> {
        try {
            this.authenticator.setCredentials({
                refresh_token: refreshToken,
                access_token: authToken,
            })
            const info = await google.people("v1").people.get({ 
                resourceName: 'people/me',
                auth: this.authenticator,
                personFields: 'names,emailAddresses,birthdays,coverPhotos,genders'
            })
            return this.processResponse(info)
        } catch (error) {
            logger.error(`ERROR => ${error}`)
            throw error
        }
    }

    private processResponse(info: any): IUserData {
        let pictureURL, gender, birthdate
        const name = info.data.names[0].givenName
        const lastName = info.data.names[0].familyName
        const email = info.data.emailAddresses[0].value
        if (info.data.coverPhotos && info.data.coverPhotos.length > 0) { pictureURL = info.data.coverPhotos[0].url }
        if (info.data.genders && info.data.genders.length > 0) { gender = info.data.genders[0].formattedValue }
        if (info.data.birthdays && info.data.birthdays.length > 1) {
            const day = info.data.birthdays[1].date.day
            const month = info.data.birthdays[1].date.month
            const year = info.data.birthdays[1].date.year
            birthdate = moment(`${day}/${month}/${year}`, 'DD/MM/YYYY')
        }
        const resourceName: string = info.data.resourceName
        const googleId = resourceName.substring(7)
        const response = { email, name, pictureURL, gender, googleId, birthdate, lastName }
        return response
    }
}

export const googleAuth: GoogleAuthentication = new GoogleAuthentication()