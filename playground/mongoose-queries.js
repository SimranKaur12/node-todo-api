var {ObjectID} = require('mongodb');

var {mongoose} = require('./../server/db/mongoose');
var {NewTodo} = require('./../server/models/NewTodo');
var {NewUsers} = require('./../server/models/NewUsers');

// var id = '5b2c8a703488ea1c71cd9984';

// if(!ObjectID.isValid(userId)) {
//     console.log('Id passed is invalid!');
// }

// NewTodo.find({
//     _id: id
// }).then((doc) => {
//     console.log('Todos',doc);
// }).catch((err) => console.log(err));

// NewTodo.findOne({
//     _id: id
// }).then((doc) => {
//     console.log('todo',doc);
// }).catch((e) => {
//     console.log(e);
// });

// NewTodo.findById(id).then((doc) => {
//     if(!doc) {
//         return console.log('id not found');
//     }
//     console.log('Todo by Id',doc);
// });

var userId = '5b2c8947dedd461b5b11ff77';

NewUsers.findById(userId).then((doc) => {
    if(!doc) {
        return console.log('id not found');
    }
    console.log('User by Id',doc);
}).catch((err) => {
    console.log(err);
});