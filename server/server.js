// var env = process.env.NODE_ENV || 'development';

// // console.log('****env****', env);

// if(env === 'development') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// }
// else if(env === 'test') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }

require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {NewTodo} = require('./models/NewTodo');
const {Users} = require('./models/Users');
const {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new NewTodo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req,res) => {
    NewTodo.find().then((todos) => {
    res.send({todos});
}).catch((err) => res.status(400).send(err));
});

app.get('/todos/:id', (req,res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(404).send('Id is invalid!');
    }
    NewTodo.findById(id).then((todo) => {
        if(!todo) {
            res.status(404).send('Id is invalid!');
        }
        res.send({todo});
    }).catch((err) => {
        res.status(400).send('Invalid Request!');
    });
});

app.delete('/todos/:id', (req,res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(404).send('Id is invalid!');
    }

    NewTodo.findByIdAndRemove(id).then((todo) => {
        if(!todo) {
            res.status(404).send('Id is invalid!');
        }
        res.send({todo});
    }).catch((err) => {
        res.status(400).send('Invalid Request!');
    });
});

app.patch('/todos/:id', (req,res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)) {
        return res.status(404).send('Id is invalid!');
    }

    if(_.isBoolean(body.completed) && body.completed) {
       body.completedAt = new Date().getTime();
    }
    else {
        body.completed = false;
        body.completedAt = null;
    }

    NewTodo.findByIdAndUpdate(id, {$set:body},{new:true}).then((todos) => {
        if(!todos) {
           return res.status(404).send('Todo not found');
        }
        res.send({todos});
    }).catch((err) => {
        res.status(400).send('An error occured');
    });
});

app.post('/users', (req,res) => {
var body = _.pick(req.body, ['email', 'password']);

var user = new Users(body);

user.save().then(() => {
    return user.generateAuthToken();
    // return res.send(user);
}).then((token) => {
 res.header('x-auth', token).send(user);
}).catch((err) => {
    res.status(400).send(err);
});
});



app.get('/users/me', authenticate, (req,res) => {
   res.send(req.user);
});

app.listen(3000, () => {
    console.log(`Started on port ${port}.`);
});

module.exports = {app};