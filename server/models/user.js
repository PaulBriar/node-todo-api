'use strict';
const mongoose = require('mongoose');
const validator = require('validator');

//Model setup
let User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: `{value} is not a valid email`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    tokens: [{
        access: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            required: true,
        }
    }]
});

//Creating new user
// let newUser = new User({
//     email: 'pbriar@live.com'
// });

// newUser.save().then((result) => {
//     console.log(result);
// }, (err) => {
//     console.log(err);
// });

module.exports = {User};