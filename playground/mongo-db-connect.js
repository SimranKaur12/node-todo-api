const mongoClient = require('mongodb').MongoClient;
// another way to import a property....
// const {MongoClient} = require('mongodb');

mongoClient.connect('mongodb://localhost:27017/TodoApp', (err,client) =>{
    if(err) {
        return console.log('Unable to connect to MongoDB server.');
    }
    console.log('Connection is established to Mongo DB server.');
    const db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //     text: 'Something has to be done..',
    //     completed: false
    // }, (err,result) => {
    //     if(err) {
    //         return console.log('Unable to insert into collection Todos', +err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined,2));
    // });

    db.collection('Users').insertOne({
        name: 'Simran Khokkar',
        age: 23,
        location: 'Pune'
    }, (err,result) => {
        if(err) {
            return console.log('Unable to insert into collection Todos', +err);
        }
        console.log(JSON.stringify(result.ops, undefined,2));
    });

    client.close();
});