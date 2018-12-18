const {ObjectID} = require('mongodb');

const {mongoose} = require("../server/db/mongoose");
const {Todo} = require("../server/models/todos");
const {User} = require("../server/models/user");

Todo.findOneAndDelete()

Todo.findByIdAndDelete('5c16f3b0594f2a39f8e49121').then((result) => {
    console.log(result);
});