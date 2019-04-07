import { IsNotEmpty, IsString, Validate } from 'class-validator'
import { CValidator, IValidationError } from '../lib/validations'

export class BlockchainConfigs extends CValidator {
    public isValid: boolean

    @IsNotEmpty({ message: `BLOCKCHAIN_ROUTE is empty` })
    @IsString({ message: `BLOCKCHAIN_ROUTE is not a String` })
    public route: string

    @IsNotEmpty({ message: `BLOCKCHAIN_PORT is empty` })
    @IsString({ message: `BLOCKCHAIN_PORT is not a String` })
    public port: string

    public validate(): IValidationError {
        this.setVariables()
        return super.validate()
    }
    //tslint:disable:member-ordering
    constructor() {
        super()
        this.route = '',
        this.port = '',
        this.isValid = false
    }

    private setVariables() {
        this.route = process.env.BLOCKCHAIN_ROUTE || ''
        this.port = process.env.BLOCKCHAIN_PORT || ''
    }
}
