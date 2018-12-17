"use strict";
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://paul:William18@ds037508.mlab.com:37508/node-todo-api-pb' ||
                'mongodb://127.0.0.1:27017/TodoApp', { useNewUrlParser: true });

module.exports= {mongoose};