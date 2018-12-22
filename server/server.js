'use strict';
require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todos');
let {User} = require('./models/user');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get("/todos", (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get("/todos/:id", (req, res) => {
    let id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    };

    Todo.findById(id).then((todo) => {
        if(!todo) {
            return console.log('ID not found');
        }
        res.send({todo});
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.delete("/todos/:id", (req, res) => {
    let id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    };

    Todo.findByIdAndDelete(id).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        return res.status(200).send({todo});
    }).catch( err => {return res.status(404).send(err)});
});

app.patch("/todos/:id", (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    };

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if(!todo) {
            return res.status(400).send();
        }
        res.send({todo});
    }).catch((err) => {
        res.status(400).send();
    })
});

// app.get("/users", (req, res) => {
//     let body = _.pick(req.body, ['email', 'password']);

//     User.findById
// });
//POSt /users
app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    let user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.listen(port, () => console.log(`Started on port ${port}`));

module.exports = {app};