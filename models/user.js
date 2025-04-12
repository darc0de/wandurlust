const mongoose = require('mongoose');
const {Schema} = mongoose;
const passportLocalMongoose = require('passport-local-mongoose'); 

userSchema = new Schema({

    email: {
        type: String,
        required: true
    },

});

// auto create and save the username & password to database with hashing and salting
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);