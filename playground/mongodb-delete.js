const {MongoClient, ObjectID} = require('mongodb');

//Comments are for changes necessary when using MongoDB v3

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db/*client*/) => {
    if(err) {
        return console.log(err);
    }
    console.log(`Connected to MongoDB server`);
    //const db = client.db('TodoApp');

    //Delete many
    // db.collection('Todos').deleteMany({text: "something to do"}).then((result) => {
    //     console.log(result);
    // });

    db.collection('Users').deleteMany({name: "Jen"}).then((result) => {
        console.log(result);
    });

    //Delete one
    // db.collection('Todos').deleteOne({text: "Buy hottub"}).then((result) => {
    //     console.log(result);
    // });

    //Find one and delete
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    //     console.log(result);
    // });

    db.collection('Users').findOneAndDelete({_id: new ObjectID('5c12b23c62dfba9ee0e9110b')}).then((result) => {
        console.log(result);
    });

    //db.close();//client.close();
});