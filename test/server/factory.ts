import { factory } from 'factory-girl'
import { User, UserAttributes, Offer, OfferAttributes, Category, CategoryAttributes, Question, QuestionAttributes,
    Goal, GoalAttributes, UserGoal, UserGoalAttributes, ConversationAttributes, MessageAttributes, Conversation, Message  } from '../../src/server/models'

factory.define('user', User, {
    email: factory.seq('User.email', (n) => `user${n}@example.com`),
    password: 'dadsaasd',
})

factory.define('user2', User, {
    email: factory.seq('User.email', (n) => `user${n}@example.com`),
    password: 'lklklklkl',
})

factory.define('offer', Offer, {
    userId: factory.assoc('user', 'id'),
    images: [],
    paymentMethod: 'Coopy',
    startDate: new Date(Date.now()),
    status: 'Started',
})

factory.define('category', Category, {
    name: 'Sports',
    deleted: false,
})

factory.define('question', Question, {
    authorId: factory.assoc('user', 'id'),
    offerId: factory.assoc('offer', 'id'),
    text: 'Some question here',
})

factory.define('goal', Goal, {
    name: 'Shared service',
    description: 'Shared service in social networks',
    amount: 20,
    code: 'someCode',
})

factory.define('userGoal', UserGoal, {
    userId: factory.assoc('user', 'id'),
    goalId: factory.assoc('goal', 'id'),
    quantity: 3,
    code: 'someCode',
})

factory.define('conversation', Conversation, {
    fromId: factory.assoc('user', 'fromId'),
    toId: factory.assoc('user2', 'toId'),
})

factory.define('message', Message, {
    authorId: factory.assoc('user', 'id'),
    conversationId: factory.assoc('conversation', 'id'),
    text: 'Some text sent in the message',
})

const createUser: UserAttributes = {
    email: 'sdfs@test.com',
    password: 'cdelsur',
    pictureURL: 'http://codigo.com',
    referalCode: 'someString',
}

const createUser2: UserAttributes = {
    email: 'sdfs2@test.com',
    password: 'cdelsur',
    pictureURL: 'http://codigo.com',
    referalCode: 'someString2',
}

const createOffer: OfferAttributes = {
    userId: 'someId',
    images: new Array(),
    paymentMethod: 'Exchange',
    startDate: new Date(Date.now()),
    status: 'Started',
    title: 'Some offer',
    exchangeInstances: ['Hour'],
    hourPrice: 10,
}

const createCategory: CategoryAttributes = {
    name: 'Sports',
    deleted: false,
}

const createQuestion: QuestionAttributes = {
    authorId: 'someId',
    offerId: 'someOfferId',
    text: 'Some text associated',
}

<<<<<<< HEAD
const createGoal: GoalAttributes = {
    name: 'Some name',
    description: 'Some description',
    amount: 20,
    code: 'someCode',
}

const createUserGoal: UserGoalAttributes = {
    userId: 'someUserId',
    goalId: 'someGoalId',
    quantity: 3,
    code: 'someCode',
}

export { factory, createUser, createUser2, createOffer, createCategory, createQuestion, createGoal, createUserGoal }
=======
const createConversation: ConversationAttributes = {
    fromId: 'someFromId',
    toId: 'someToId',
}

const createMessage: MessageAttributes = {
    authorId: 'someAuthorId',
    conversationId: 'someConversationId',
    text: 'Some text sent in the message',
}

export { factory, createUser, createUser2, createOffer, createCategory, createQuestion, createConversation, createMessage }
>>>>>>> First approach to message tests
