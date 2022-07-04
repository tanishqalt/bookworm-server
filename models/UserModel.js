const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
    },
    readingList: {
        type: Array,
        default: [],
    },
    userType: {
        type: String,
        default: 'user',
    }
})

const User = mongoose.model('User', userSchema);
module.exports = User;