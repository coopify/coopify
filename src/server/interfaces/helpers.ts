import * as moment from 'moment'
import { ErrorPayload } from '../errorPayload'
import { logger } from '../services'

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

export function validateStatus(status: string) {
    if (status !== 'Started' && status !== 'Paused' ) {
        throw new ErrorPayload(400, 'Invalid status')
    }
}

export function validateProposalStatus(status: string) {
    switch (status) {
        case 'Waiting':
        case 'Rejected':
        case 'Confirmed':
        case 'PaymentPending':
        case 'PaymentFailed':
        case 'Cancelled':
        case 'Reviewed':
            return
        default:
            throw new ErrorPayload(400, 'Invalid status')
    }
}

export function validatePaymentMethod(paymentMethod: string) {
    if (paymentMethod !== 'Coopy' && paymentMethod !== 'Exchange' ) {
        throw new ErrorPayload(400, 'Invalid payment method')
    }
}

export function validateFrecuency(frequency: string) {
    if (frequency !== 'Hour' && frequency !== 'Session' && frequency !== 'FinalProduct' ) {
        throw new ErrorPayload(400, 'Invalid frecuency type')
    }
}

export function handleError(error: Error | ErrorPayload): ErrorPayload {
    if (error instanceof ErrorPayload) {
        logger.info(`Handled error => ${JSON.stringify(error)}`)
        return error
    } else {
        logger.error(`Unhandled error => ${JSON.stringify(error)} - ${error}`)
        return new ErrorPayload(500, 'Something went wrong', error)
    }
}
