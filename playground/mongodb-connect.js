const {MongoClient, ObjectID} = require('mongodb');

//Comments are for changes necessary when using MongoDB v3

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db/*client*/) => {
    if(err) {
        return console.log(err);
    }
    console.log(`Connected to MongoDB server`);
    //const db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //     text: "something to do",
    //     completed: false,
    // }, (err, result) => {
    //     if(err) {
    //         return console.log(err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // db.collection('Users').insertOne({
    //     name: 'Paul Briar',
    //     age: 32,
    //     location: 'Dartmouth, NS'
    // }, (err, result) => {
    //     if(err) {
    //         return console.log(err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
        
    // });

    db.close();//client.close();
});