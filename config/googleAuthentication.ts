import { IsNotEmpty, IsString, IsBoolean } from 'class-validator'
import { CValidator, IValidationError } from '../lib/validations'

export class GoogleConfigs extends CValidator {
    public isValid: boolean

    @IsNotEmpty({ message: `CLIENT_ID is empty` })
    @IsString({ message: `CLIENT_ID is not a String` })
    public clientId: string

    @IsNotEmpty({ message: `CLIENT_SECRET is empty` })
    @IsString({ message: `CLIENT_SECRET is not a String` })
    public clientSecret: string

    @IsNotEmpty({ message: `REDIRECT_URL is empty` })
    @IsString({ message: `REDIRECT_URL is not a String` })
    public redirectURL: string

    public validate(): IValidationError {
        this.setVariables()
        return super.validate()
    }

    //tslint:disable:member-ordering
    constructor() {
        super()
        this.clientId = '',
        this.isValid = false
        this.clientSecret = '',
        this.redirectURL = ''
    }

    private setVariables() {
        this.clientId = process.env.CLIENT_ID || ''
        this.clientSecret = process.env.CLIENT_SECRET || ''
        this.redirectURL = process.env.REDIRECT_URL || ''
    }
}
