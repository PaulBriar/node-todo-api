const {MongoClient, ObjectID} = require('mongodb');

//Comments are for changes necessary when using MongoDB v3

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db/*client*/) => {
    if(err) {
        return console.log(err);
    }
    console.log(`Connected to MongoDB server`);
    //const db = client.db('TodoApp');

    // db.collection('Todos').find({
    //     _id: new ObjectID('5c12a48fad2437a904e30cf5')}).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log(err);
    // })

    db.collection('Users').find({name: "Mike"}).toArray().then((docs) => {
        console.log(JSON.stringify(docs, undefined, 2));
    },  (err) => {
        console.log(err);
    });

    // db.collection('Todos').find({
    //     }).count().then((count) => {
    //     console.log(`Todos count: ${count}`);
    // }, (err) => {
    //     console.log(err);
    // })

    db.close();//client.close();
});