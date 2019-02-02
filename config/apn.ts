import { IsNotEmpty, IsString, IsBoolean } from 'class-validator'
import { CValidator, IValidationError } from '../lib/validations'

export class ApnConfigs extends CValidator {
    public isValid: boolean

    @IsNotEmpty({ message: `IOS_P8_FILE_NAME is empty` })
    @IsString({ message: `IOS_P8_FILE_NAME is not a String` })
    public p8FilePath: string

    @IsNotEmpty({ message: `IOS_TEAM_ID is empty` })
    @IsString({ message: `IOS_TEAM_ID is not a String` })
    public teamId: string

    @IsNotEmpty({ message: `IOS_KEY_ID is empty` })
    @IsString({ message: `IOS_KEY_ID is not a String` })
    public keyId: string

    @IsNotEmpty({ message: `IOS_BUNDLE_IDENTIFIER is empty` })
    @IsString({ message: `IOS_BUNDLE_IDENTIFIER is not a String` })
    public bundleIdentifier: string

    @IsBoolean({ message: `IOS_RELEASE is not a Boolean` })
    @IsNotEmpty({ message: `IOS_RELEASE is empty` })
    public release: boolean

    public validate(): IValidationError {
        this.setVariables()
        return super.validate()
    }

    private setVariables() {
        this.p8FilePath = process.env.IOS_P8_FILE_NAME || ''
        this.teamId = process.env.IOS_TEAM_ID || ''
        this.keyId = process.env.IOS_KEY_ID || ''
        this.bundleIdentifier = process.env.IOS_BUNDLE_IDENTIFIER || ''
        this.release = Boolean(process.env.IOS_RELEASE)
    }
}
