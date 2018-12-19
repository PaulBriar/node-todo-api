"use strict";
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://paul:William18@ds037508.mlab.com:37508/node-todo-api-pb');

module.exports= {mongoose};