import { factory } from 'factory-girl'
import { User, UserAttributes, Offer, OfferAttributes, Category, CategoryAttributes, Question, QuestionAttributes,
    Goal, GoalAttributes, Proposal, ProposalAttributes, UserGoal, UserGoalAttributes, ConversationAttributes, MessageAttributes,
    Conversation, Message,
} from '../../src/server/models'

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

factory.define('proposal', Proposal, {
    proposerId: factory.assoc('user', 'id'),
    offerId: factory.assoc('offer', 'id'),
    status: 'Waiting',
    conversationId: factory.assoc('conversation', 'id'),
    exchangeMethod: 'Coopy',
    exchangeInstance: 'Hour',
    proposedPrice: 50,
})

const createUser: UserAttributes = {
    email: 'sdfs@test.com',
    password: 'cdelsur',
    pictureURL: 'http://codigo.com',
    referalCode: 'someString',
}

const createProposal: ProposalAttributes = {
    offerId: 'someId',
    proposerId: 'someProposerId',
    status: 'Waiting',
    conversationId: 'conversationId',
    exchangeMethod: 'Coopy',
    exchangeInstance: 'Hour',
    proposedPrice: 50,
}

const createUser2: UserAttributes = {
    email: 'sdfs2@test.com',
    password: 'cdelsur',
    pictureURL: 'http://codigo.com',
    referalCode: 'someString22',
}

const createUser3: UserAttributes = {
    email: 'sdfs3@test.com',
    password: 'cdelsur',
    pictureURL: 'http://codigo.com',
    referalCode: 'someString3',
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
    code: 'someCode',
}

const createUserGoal: UserGoalAttributes = {
    userId: 'someUserId',
    goalId: 'someGoalId',
    quantity: 3,
    code: 'someCode',
}

const createConversation: ConversationAttributes = {
    fromId: 'someFromId',
    toId: 'someToId',
}

const createMessage: MessageAttributes = {
    authorId: 'someAuthorId',
    conversationId: 'someConversationId',
    text: 'Some text sent in the message',
}

export { factory, createUser, createUser2, createUser3, createOffer, createCategory, createQuestion, createConversation,
    createMessage, createGoal, createUserGoal, createProposal }
