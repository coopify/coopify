import { IsInt, IsString, IsNotEmpty, Validate } from 'class-validator'
import { CValidator, IValidationError, IsValidEnv } from '../lib/validations'

export class ServerConfigs extends CValidator {
    public isValid: boolean

    @IsNotEmpty({ message: `PORT is empty` })
    @IsInt({ message: `PORT is not a Number` })
    public port: number

    @Validate(IsValidEnv, { message: `NODE_ENV is not a valid environment` })
    @IsString({ message: `NODE_ENV is not a String` })
    public environment: string

    @IsString({ message: `BASE_PATH is not a String` })
    @IsNotEmpty({ message: `BASE_PATH is empty` })
    public basePath: string

    public validate(): IValidationError {
        this.setVariables()
        return super.validate()
    }

    //tslint:disable:member-ordering
    constructor() {
        super()
        this.environment = '',
        this.isValid = false
        this.basePath = ''
        this.port = 1
      }

    private setVariables() {
        this.port = Number(process.env.PORT)
        this.environment = process.env.NODE_ENV || ''
        this.basePath = process.env.BASE_PATH || ''
    }
}
