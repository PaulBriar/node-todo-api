const {ObjectID} = require('mongodb');

const {mongoose} = require("../server/db/mongoose");
const {Todo} = require("../server/models/todos");
const {User} = require("../server/models/user");

let id = '5c15131e9955e402a95f66621';

if(!ObjectID.isValid(id)) {
    console.log('ID is not valid');
};

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos' + todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo' + todo);
// });

// Todo.findById(id).then((todo) => {
//     if(!todo) {
//         return console.log('Id not found');
//     }
//     console.log('Todo by id ' + todo)
// }).catch((err) => console.log(err));

User.findById(id).then((user) => {
    if(!user) {
        return console.log('User not found');
    }
    console.log('User by id ' + user);
}, (err) => {
    console.log(err);
});