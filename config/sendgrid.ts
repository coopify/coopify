import { IsNotEmpty, IsString, Validate } from 'class-validator'
import { CValidator, IValidationError } from '../lib/validations'

export class SendgridConfigs extends CValidator {
    public isValid: boolean

    @IsNotEmpty({ message: `SENDGRID_APIKEY is empty` })
    @IsString({ message: `SENDGRID_APIKEY is not a String` })
    public apikey: string

    /*@IsNotEmpty({ message: `FRONTEND_HOST is empty` })
    @IsString({ message: `FRONTEND_HOST is not a String` })
    public frontendHost: string

    @IsNotEmpty({ message: `INTENT_EMAIL is empty` })
    @IsString({ message: `INTENT_EMAIL is not a String` })
    public intentEmail: string

    @IsNotEmpty({ message: `EMAIL_ASSETS_ROUTE is empty` })
    @IsString({ message: `EMAIL_ASSETS_ROUTE is not a String` })
    public assetsRoute: string*/

    public validate(): IValidationError {
      this.setVariables()
      return super.validate()
    }

    //tslint:disable:member-ordering
    constructor() {
      super()
      this.apikey = '',
      this.isValid = false
    }

    private setVariables() {
      this.apikey = process.env.SENDGRID_APIKEY || ''
      /*this.frontendHost = process.env.FRONTEND_HOST || ''
      this.intentEmail = process.env.INTENT_EMAIL || ''
      this.assetsRoute = process.env.EMAIL_ASSETS_ROUTE || ''*/
    }
  }
