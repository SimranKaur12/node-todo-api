var mongoose = require('mongoose');

var NewTodo = mongoose.model('NewTodo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

// var newTodo = new NewTodo({
//     text: 'Something new.'
// });

// newTodo.save().then((doc) => {
// console.log('New Todo', doc);
// }).catch((err) => {
//     console.log('Unable to save', err);
// });

// var newTodo2 = new NewTodo({
//     text: 'The second one',
//     completed: true,
//     completedAt: 2345
// });

// newTodo2.save().then((doc) => {
// console.log('New Todo', doc);
// }).catch((err) => {
//     console.log('Unable to save', err);
// });

module.exports = {NewTodo};