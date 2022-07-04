const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    isbn: {
        type: String,
    },
    timesRead: {
        type: Number,
        default: 0,
    },
    ratings: {
        type: Array,
    }
}
);

const Book = mongoose.model('Book', bookSchema);

// index on the book title
bookSchema.index({ title: 'text' });

// create index
Book.createIndexes();


module.exports = Book;