import * as moment from 'moment'
import { ErrorPayload } from '../errorPayload';

export function validateBirthdate(date: Date) {
    moment.isDate(date)
    const difference = moment(Date.now()).diff(moment(date), 'years')
    if (difference < 18 ) { throw new ErrorPayload(400, 'You must be over 18 years old') }
}

export function validateGender(gender: string) {
    if (gender !== 'Male' && gender !== 'Female' && gender !== 'Unspecified' && gender !== 'Other' ) {
        throw new ErrorPayload(400, 'Invalid gender')
    }
}

export function validateStatus(gender: string) {
    if (gender !== 'Started' && gender !== 'Paused' ) {
        throw new ErrorPayload(400, 'Invalid status')
    }
}