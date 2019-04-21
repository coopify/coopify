import { Question, QuestionAttributes, QuestionUpdateAttributes } from '../models'
import { logger } from '../services'
import { ErrorPayload } from '../errorPayload'

export async function getAsync(id: string): Promise<Question | null> {
    try {
        const questionInstance = await Question.getAsync(id)
        if (!questionInstance) { throw new ErrorPayload(404, 'Question not found') }

        return questionInstance
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}

export async function findAsync(where: object, limit?: number, skip?: number): Promise<{ rows: Question[], count: number } | null> {
    try {
        const questionInstances = await Question.getManyAsync(where, limit, skip)
        if (!questionInstances) { throw new ErrorPayload(500, 'Failed to find questions') }

        return questionInstances
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}

export async function findOneAsync(where: object): Promise<Question | null> {
    try {
        const questionInstances = await Question.getOneAsync(where)
        if (!questionInstances) { throw new ErrorPayload(500, 'Failed to find a question') }

        return questionInstances
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}

export async function createAsync(body: QuestionAttributes): Promise<Question> {
    try {
        const questionInstance = await Question.createAsync(body)
        if (!questionInstance) { throw new ErrorPayload(500, 'Failed to create a question') }

        return questionInstance
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}

export async function updateAsync(question: Question, body: QuestionUpdateAttributes): Promise<Question | null> {
    try {
        const questionInstance = await Question.updateAsync(question.id, body)
        if (!questionInstance) { throw new ErrorPayload(500, 'Failed to update a question') }
        return questionInstance
    } catch (error) {
        logger.error(new Error(error))
        throw error
    }
}
