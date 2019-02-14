import { IsBoolean, IsInt, IsNotEmpty, IsString, Validate } from 'class-validator'
import { CValidator, IValidationError } from '../lib/validations'
import * as config from '../config'
export class RedisConfigs extends CValidator {
    public isValid: boolean

    @IsNotEmpty({ message: `REDIS_PORT is empty` })
    @IsInt({ message: `REDIS_PORT is not a Number` })
    public port: number

    @IsNotEmpty({ message: `REDIS_HOST is empty` })
    @IsString({ message: `REDIS_HOST is not a String` })
    public host: string

    @IsNotEmpty({ message: `REDIS_PASSWORD is empty` })
    @IsString({ message: `REDIS_PASSWORD is not a String` })
    public password: string

    @IsNotEmpty({ message: `REDIS_USERNAME is empty` })
    @IsString({ message: `REDIS_USERNAME is not a String` })
    public username: string

    public validate(): IValidationError {
      this.setVariables()
      return super.validate()
    }

    constructor() {
      super()
      this.host = '',
      this.isValid = false
      this.username = '',
      this.password = ''
      this.port = 1
    }

    private setVariables() {
      this.port = Number(process.env.REDIS_PORT)
      this.host = process.env.REDIS_HOST || ''
      this.password = process.env.REDIS_PASSWORD || ''
      this.username = process.env.REDIS_USERNAME || ''
    }
  }
