import { Question, QuestionAttributes, QuestionUpdateAttributes } from '../models'
import { ErrorPayload } from '../errorPayload'
import { handleError } from './helpers'

export async function getAsync(id: string): Promise<Question> {
    try {
        const questionInstance = await Question.getAsync(id)
        if (!questionInstance) { throw new ErrorPayload(404, 'Question not found') }

        return questionInstance
    } catch (error) {
        throw handleError(error)
    }
}

export async function findAsync(where: object, limit?: number, skip?: number): Promise<{ rows: Question[], count: number }> {
    try {
        const questionInstances = await Question.getManyAsync(where, limit, skip)
        if (!questionInstances) { throw new ErrorPayload(500, 'Failed to find questions') }

        return questionInstances
    } catch (error) {
        throw handleError(error)
    }
}

export async function findOneAsync(where: object): Promise<Question | null> {
    try {
        const questionInstance = await Question.getOneAsync(where)
        //if (!questionInstance) { throw new ErrorPayload(404, 'Question not found') }

        return questionInstance
    } catch (error) {
        throw handleError(error)
    }
}

export async function createAsync(body: QuestionAttributes): Promise<Question> {
    try {
        const questionInstance = await Question.createAsync(body)
        if (!questionInstance) { throw new ErrorPayload(500, 'Failed to create a question') }

        return questionInstance
    } catch (error) {
        throw handleError(error)
    }
}

export async function updateAsync(question: Question, body: QuestionUpdateAttributes): Promise<Question> {
    try {
        const questionInstance = await Question.updateAsync(question.id, body)
        if (!questionInstance) { throw new ErrorPayload(500, 'Failed to update a question') }
        return questionInstance
    } catch (error) {
        throw handleError(error)
    }
}
