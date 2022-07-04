/**
 *  A simple database model that stores username, email, book title, and book author.
 */

const mongoose = require('mongoose');


const requestSchema = new mongoose.Schema({
        username: {
            type: String,
        },
        bookTitle: {
            type: String,
        },
        bookAuthor: {
            type: String,
        }
    }
);

const BookRequest = mongoose.model('Request', requestSchema);

module.exports = BookRequest;