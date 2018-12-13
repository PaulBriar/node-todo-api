const {MongoClient, ObjectID} = require('mongodb');

//Comments are for changes necessary when using MongoDB v3

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db/*client*/) => {
    if(err) {
        return console.log(err);
    }
    console.log(`Connected to MongoDB server`);
    //const db = client.db('TodoApp');

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5c12edef62dfba9ee0e913a8')
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result);
        
    // });

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5c12a5cde231f2a9835c8692')
    }, {
        $set: {
            name: "Jen"
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
        
    });

    //db.close();//client.close();
});