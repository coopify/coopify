import { factory } from 'factory-girl'
import { User, UserAttributes, Offer, OfferAttributes, Category, CategoryAttributes, Question, QuestionAttributes, Goal, GoalAttributes } from '../../src/server/models'

factory.define('user', User, {
    email: factory.seq('User.email', (n) => `user${n}@example.com`),
    password: 'dadsaasd',
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
})

const createUser: UserAttributes = {
    email: 'sdfs@test.com',
    password: 'cdelsur',
    pictureURL: 'http://codigo.com',
}

const createUser2: UserAttributes = {
    email: 'sdfs2@test.com',
    password: 'cdelsur',
    pictureURL: 'http://codigo.com',
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

const createGoal: GoalAttributes = {
    name: 'Some name',
    description: 'Some description',
    amount: 20,
}

export { factory, createUser, createUser2, createOffer, createCategory, createQuestion, createGoal }
