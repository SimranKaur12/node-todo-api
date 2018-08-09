// import { Server } from 'http';

const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var userSchema = mongoose.Schema({ email: {
    type: String,
    require: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
        validator: validator.isEmail,
        message: '{VALUE} is not a valid email'
    }
},
password: {
    type: String,
    required: true,
    minlength: 6
},
tokens: [{
    access: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    }
}]});

// overriding a method
userSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

userSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens = user.tokens.concat([{access, token}]);
    // user.tokens.push({access, token});

    return user.save().then(() => {
        return token;
    });

    // instead of chaining promises to be returned to Server.js, the above two statements would return only the Value.
};

userSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch(e) {
        // return new Promise((resolve,reject) => {
        //     reject();
        // });
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

userSchema.pre('save', function (next) {
    var user = this;

    if(user.isModified()) {
    
        bcrypt.genSalt(10, (err,salt) => {
            bcrypt.hash(user.password, salt, (err,hash) => {
                if(!err) { 
                    user.password = hash;
                    next();
                }
            });
        });

    }
    else {
        next();
    }
});

var Users = mongoose.model('Users', userSchema);

// var newUser = new users({
//     email: 'simran@gmail.com'
// });

// newUser.save().then((doc) => {
// console.log('New user', doc);
// }).catch((err) => {
//     console.log('Unable to save', err);
// });

module.exports = {Users};