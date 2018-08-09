const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,client) =>{
    if(err) {
        return console.log('Unable to connect to MongoDB server.');
    }
    console.log('Connection is established to Mongo DB server.');
    const db = client.db('TodoApp');

   db.collection('Todos').find({
       _id: new ObjectID('5b28c99c5a2a1951d0f17cbc')
   }).toArray().then((docs) => {
       console.log('Todos docs:');
       console.log(docs);
   }).catch((err) => {
       console.log('Unable to fetch the Todos docs.', err);
   });

   db.collection('Todos').find().count().then((count) => {
    console.log(`Todos count: ${count}`);
}).catch((err) => {
    console.log('Unable to fetch the Todos docs.', err);
});

db.collection('Users').find({name: 'Simran'}).toArray().then((docs) => {
    console.log('Users docs:');
    console.log(docs);
}).catch((err) => {
    console.log('Unable to fetch the Todos docs.', err);
});

    // client.close();
});