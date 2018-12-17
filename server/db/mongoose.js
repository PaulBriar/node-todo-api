"use strict";
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGOHQ_URL ||
                'mongodb://127.0.0.1:27017/TodoApp', { useNewUrlParser: true });

module.exports= {mongoose};