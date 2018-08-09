const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,client) =>{
    if(err) {
        return console.log('Unable to connect to MongoDB server.');
    }
    console.log('Connection is established to Mongo DB server.');
    const db = client.db('TodoApp');

    // deleteMany
    // db.collection('Todos').deleteMany({text: 'Example for delete'}).then((result) => {
    //     console.log(result);
    // });

    // deleteOne
    // db.collection('Todos').deleteOne({text:'Example for one'}).then((result) => {
    //     console.log(result);
    // });

    // db.collection('Todos').findOneAndDelete({text:'Example for one'}).then((result) => {
    //     console.log(result);
    // });

    db.collection('Users').deleteMany({name: 'Simran'}).then((result) => {
        console.log(result.result.n);
    });

    db.collection('Users').findOneAndDelete({
        _id: new ObjectID('5b28de0204f03f22334a9fc7')
    }).then((result) => {
        console.log(result);
    });

     // client.close(); coz can interfere with the query we want to perform.
});