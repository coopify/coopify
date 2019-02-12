import { IsInt, IsString, IsNotEmpty, Validate } from 'class-validator'
import { CValidator, IValidationError } from '../lib/validations'

export class FacebookConfigs extends CValidator {
    public isValid: boolean

    @IsNotEmpty({ message: `FB_APIKEY is empty` })
    @IsString({ message: `FB_APIKEY is not a String` })
    public apikey: string

    @IsNotEmpty({ message: `FB_SECRET is empty` })
    @IsString({ message: `FB_SECRET is not a String` })
    public secret: string

    @IsNotEmpty({ message: `FB_REDIRECT is empty` })
    @IsString({ message: `FB_REDIRECT is not a String` })
    public redirect: string

    public validate(): IValidationError {
        this.setVariables()
        return super.validate()
    }

    private setVariables() {
      this.apikey = process.env.FB_APIKEY || ''
      this.secret = process.env.FB_SECRET || ''
      this.redirect = process.env.FB_REDIRECT || ''
    }
  }
