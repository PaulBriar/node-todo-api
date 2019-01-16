'use strict';
require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todos');
let {User} = require('./models/user');
let {authenticate} = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.get("/todos", authenticate, async (req, res) => {
    try {
        const todos = await Todo.find({ _creator: req.user._id});
        res.send({todos});
    } catch (err) {
        res.status(400).send(err);
    }
});

//Add new todo
app.post('/todos', authenticate, async (req, res) => {
    try {
        let todo = new Todo({
            text: req.body.text,
            _creator: req.user._id
        });
        await todo.save();
        res.send(todo);
    } catch (err) {
        res.status(400).send(err);
    }
});

//Get Todo by id
app.get("/todos/:id", authenticate, async (req, res) => {
    try {
        let id = req.params.id;
        if(!ObjectID.isValid(id)) {
            return res.status(404).send();
        };
        const todo = await Todo.findOne({ _id: id, _creator: req.user._id});
        !todo ? console.log('ID not found') : res.send({todo});

    } catch (err ) {
        res.status(400).send(err);
    }
});

//Update Todo by id
app.patch("/todos/:id", authenticate, async (req, res) => {
    try {
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
        const todo = await Todo.findOneAndUpdate({
            _id: id,
            _creator: req.user._id,
        }, {$set: body}, {new: true});
        !todo ? res.status(404).send() : res.send({todo});
    } catch (err) {
        res.status(400).send();
    }
});

//Delete Todo by id
app.delete("/todos/:id", authenticate, async (req, res) => {
        const id = req.params.id;
        if(!ObjectID.isValid(id)) {
            return res.status(404).send();
        }

    try {
        const todo = await Todo.findOneAndRemove({
            _id: id,
            _creator: req.user._id
        });
        !todo ? res.status(404).send() : res.status(200).send({todo});
    } catch (err) {
        res.status(404).send(err);
    }
});

//Create new user
app.post('/users', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = new User(body);
        await user.save();
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.get("/users/me", authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
});
//Delete user token
app.delete('/users/me/token', authenticate, async (req, res) => {
    try {
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch (err) {
        res.status(400).send(err);
    }
});


app.listen(port, () => console.log(`Started on port ${port}`));

module.exports = {app};