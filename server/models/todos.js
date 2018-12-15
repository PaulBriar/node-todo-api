'use strict';

let mongoose = require('mongoose');

let Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    completedAt: {
        type: Number,
        default: null,
    }
});

//Creating new todo
// let newTodo = new Todo({
//     text: 'Go shopping'
// });

// newTodo.save().then((result) => {
//     console.log(result);
// }, (err) => {
//     console.log(err);
// });

module.exports = {Todo};