const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {NewTodo} = require('./../../models/NewTodo');
const {Users} = require('./../../models/Users');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
    },{
        _id: new ObjectID(),
        text: 'Second test todo',
        completed: true,
        completedAt: 345
    }];

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'simran@example.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'second@example.com',
    password: 'userTwoPass'
}];
    
const populateTodos = (done) => {
    NewTodo.remove({}).then(() => {
        return NewTodo.insertMany(todos);
}).then(() => done());
};

const populateUsers = (done) => {
Users.remove({}).then(() => {
    var userOne = new Users(users[0]).save();
    var userTwo = new Users(users[1]).save();
    return Promise.all([userOne,userTwo]);
}).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};