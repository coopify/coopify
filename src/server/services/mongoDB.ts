import { Mongoose } from 'mongoose'
import { logger } from './wLogger'

export interface IOptions {
    uri: string
    mongoOptions?: any
}

/*
    This class was created to work with Mongoose as ODM, you can find more information
    regarding Mongoose here:
        http://mongoosejs.com

    TODO: find documentation for Typescript
*/
export class MongoDB {
    public client: Mongoose
    public isConnected: boolean

    constructor() {
        this.client = new Mongoose()
        this.isConnected = false
    }

    public async initAsync(options: IOptions) {
        try {
            /*
                Setup listeners to be notified when connection status changes

                TODO: Re-connect, take measures on status changes
            */
            this.client.connection.on('connected', (conn) => logger.info(`MongoDB => Connected`))
            this.client.connection.on('disconnected', (conn) => logger.error(`MongoDB => Disconnected`))
            this.client.connection.on('error', (err) => logger.error(`MongoDB => ${err}`))

            /*
                Connect to db with url
            */
            this.client.connect(options.uri, { useMongoClient: true })
        } catch (error) {
            logger.error(`MongoDB => ${error}`)
        }

    }
}

export const mongodb: MongoDB = new MongoDB()
