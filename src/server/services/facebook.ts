import * as FB from 'fb'
import { ErrorPayload } from '../errorPayload'
import { logger } from '../services'
import * as moment from 'moment'
import { User, Offer } from '../models'

export interface IOptions {
    apikey: string,
    secret: string,
    redirect: string
}

export interface IUserData {
    email: string,
    pictureURL: string,
    FBId: string,
    name: string
    lastName: string,
    birthdate: Date,
    gender: string,
}

export class FacebookService {
    public options: IOptions

    constructor(options: IOptions) {
        this.options = options
        FB.options(this.initConfigs())
        logger.info('Facebook => Initialized')
    }

    public initConfigs() {
        return {
            appId: this.options.apikey,
            appSecret: this.options.secret,
            version: 'v3.2',
            scope: 'user_birthday, user_gender, email, public_profile', //, publish_actions, manage_pages',
        }
    }

    public generateAuthUrl(): string {
        return FB.getLoginUrl({
            redirectUri: this.options.redirect,
        })
    }

    public async exchangeCodeAsync(code: string): Promise<object | any> {
        return new Promise((resolve, reject) => {
            FB.api('oauth/access_token', {
                client_id: this.options.apikey,
                client_secret: this.options.secret,
                redirect_uri: this.options.redirect,
                code,
            }, (res) => {
                if (!res || res.error) {
                    reject(res.error)
                }
                return resolve(res)
            })
        })
    }

    public async getUserDataAsync(token: string): Promise<object | any> {
        FB.setAccessToken(token)
        return new Promise((resolve, reject) => {
            FB.api(`/me?fields=id,name,email,picture,birthday,gender,last_name`, (res) => {
                if (!res || res.error) {
                    logger.error(!res ? 'error occurred' : res.error)
                    reject(res.error)
                }
                return resolve(res)
            })
        })
    }

    public transform(fbResponse: any): IUserData {
        logger.info(`fbResponse`)
        const pictureURL = fbResponse.picture.data.url
        const birthdate = moment(fbResponse.birthday, 'MM/DD/YYYY').toDate()
        return {
            FBId: fbResponse.id,
            birthdate,
            email: fbResponse.email,
            name: fbResponse.name,
            gender: fbResponse.gender.charAt(0).toUpperCase() + fbResponse.gender.slice(1),
            lastName: fbResponse.last_name,
            pictureURL,
        }
    }

    public async getPostStatsAsync(uri: string): Promise<any> {
        return new Promise((resolve, reject) => {
            FB.api(`/v3.2/?id=${uri}&fields=engagement&access_token=${this.options.apikey}|${this.options.secret}`, (res) => {
                if (!res || res.error) {
                    logger.error(!res ? 'error occurred' : res.error)
                    throw new ErrorPayload(500, 'Facebook error', res.error)
                }
                const engagement: number = res.engagement && res.engagement.share_count ? res.engagement.share_count : 0
                return resolve(engagement)
            })
        })
    }
}
