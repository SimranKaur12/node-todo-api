const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// var message = 'I am trying to hash';
// var hash = SHA256(message).toString();

// console.log('The original string:', message);
// console.log('The hash is:', hash);

// var data = {
// id: 4
// };

// var hashedData = {
// data,
// hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };

// // hashedData.data.id = 5;
// // hashedData.hash = SHA256(JSON.stringify(data)).toString();

// var hashResult = SHA256(JSON.stringify(hashedData.data) + 'somesecret').toString();

// if(hashResult === hashedData.hash) {
//     console.log('Data is not changed');
// } else {
//     console.log('Data has been changed');
// }

// var data = {
// id: 10
// };

// var token = jwt.sign(data, 'abc123');
// console.log('token:', token);
// var decoded = jwt.verify(token, 'abc123');
// console.log('Decoded:',decoded);

var password = 'simran12';

// bcrypt.genSalt(10, (err,salt) => {
//     bcrypt.hash(password,salt, (err,res) => {
//         console.log(res);
//     });
// });

var hashedValue = '$2a$10$57shSq51HPgSGel933v2uuLAHUcmAUtubIazsHEPiq6NWhjq.1S4m';

bcrypt.compare('simran',hashedValue, (err,res) => {
    console.log(res);
});