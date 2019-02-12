import * as FB from 'fb'
import { ErrorPayload } from '../errorPayload'
import { logger } from '../services'

export interface IOptions {
    apikey: string,
    secret: string,
    redirect: string
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
            scope: 'email',
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
                resolve(res)
            })
        })
    }

    public async getUserDataAsync(token: string): Promise<object | any> {
        FB.setAccessToken(token)
        return new Promise((resolve, reject) => {
            FB.api(`/me?fields=name,email`, (res) => {
                if (!res || res.error) {
                    logger.error(!res ? 'error occurred' : res.error)
                    reject(res.error)
                }
                resolve(res)
            })
        })
    }

}
