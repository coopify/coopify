export class ErrorPayload {
    constructor(public code: number, public message: string, public detail?: any) {}
}
