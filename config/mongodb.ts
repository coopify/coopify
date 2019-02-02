import { IsInt, IsString, IsNotEmpty, Validate } from 'class-validator'
import { CValidator, IValidationError } from '../lib/validations'

export class MongoConfigs extends CValidator {
    public isValid: boolean

    @IsNotEmpty({ message: `MONGO_DB_HOST is empty` })
    @IsString({ message: `MONGO_DB_HOST is not a String` })
    public host: string

    @IsNotEmpty({ message: `MONGO_DB_NAME is empty` })
    @IsString({ message: `MONGO_DB_NAME is not a String` })
    public name: string

    @IsNotEmpty({ message: `MONGO_DB_PASSWORD is empty` })
    @IsString({ message: `MONGO_DB_PASSWORD is not a String` })
    public password: string

    @IsNotEmpty({ message: `MONGO_DB_PORT is empty` })
    @IsInt({ message: `MONGO_DB_PORT is not a Number` })
    public port: number

    @IsNotEmpty({ message: `MONGO_DB_USER is empty` })
    @IsString({ message: `MONGO_DB_USER is not a String` })
    public user: string

    public validate(): IValidationError {
        this.setVariables()
        return super.validate()
    }

    public getConnectionString(): string {
      return `mongodb://${this.user}:${this.password}@${this.host}:${this.port}/${this.name}`
    }

    private setVariables() {
      this.host = process.env.MONGO_DB_HOST || ''
      this.name = process.env.MONGO_DB_NAME || ''
      this.password = process.env.MONGO_DB_PASSWORD || ''
      this.port = Number(process.env.MONGO_DB_PORT)
      this.user = process.env.MONGO_DB_USER || ''
    }
  }
