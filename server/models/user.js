'use strict';

let mongoose = require('mongoose');

let User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
    }
});

// let newUser = new User({
//     email: 'pbriar@live.com'
// });

// newUser.save().then((result) => {
//     console.log(result);
// }, (err) => {
//     console.log(err);
// });

module.exports = {User};