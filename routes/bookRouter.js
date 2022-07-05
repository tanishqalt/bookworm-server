const express = require('express');
const router = express.Router();
const Book = require('../models/BookModel');

/**
 *  Get all books
 */

router.get('/all', async (req, res) => {
	const books = await Book.find();
	res.status(200).json({
		success: true,
		books,
	});
});

/** Get all books in the descending order of timesRead */

router.get('/trending', async (req, res) => {
	const books = await Book.find().sort({ timesRead: -1 });
	res.status(200).json({
		success: true,
		books,
	});
});

/** Add a new book */

router.post('/new', async (req, res) => {
	const book = new Book({
		title: req.body.title,
		author: req.body.author,
		description: req.body.description,
		isbn: req.body.isbn,
		timesRead: req.body.timesRead,
		ratings: req.body.ratings,
	});

	try {
		await book.save();
		res.status(200).json({
			success: true,
			message: 'Book created successfully',
		});
	} catch (err) {
		res.status(200).json({
			success: false,
			message: 'Error creating book',
		});
	}
});

/** Pick a random book from the database */

router.get('/random', async (req, res) => {
	const books = await Book.find();
	const randomBook = books[Math.floor(Math.random() * books.length)];
	res.status(200).json({
		success: true,
		randomBook,
	});
});

/** Get a book by ObjectID */

router.get('/:id', async (req, res) => {
	const book = await Book.findById(req.params.id);
	res.status(200).json({
		success: true,
		book,
	});
});

/** Add a book rating */

router.post('/update-rating', async (req, res) => {
	const book = await Book.findById(req.body.id);
	const username = req.body.rating.username;

	// check if the user has already rated the book. to do this, loop through all the ratings of the book and see if the username key of any object matches the username in the request body

	// find the user
	const user = await User.findOne({ username: username });

	for (let i = 0; i < book.ratings.length; i++) {
		if (book.ratings[i].username === username) {
			return res.status(200).json({
				success: false,
				message: 'User already rated this book',
				user: user,
			});
		}
	}

	book.ratings.push(req.body.rating);
	try {
		await book.save();
		res.status(200).json({
			success: true,
			message: 'Rating added successfully',
		});
	} catch (err) {
		res.status(200).json({
			success: false,
			message: 'Error adding rating',
		});
	}
});

/** Get books based on keyword */

router.get('/search/:keyword', async (req, res) => {
	const books = await Book.find({
		$text: {
			$search: req.params.keyword,
		},
	});
	res.status(200).json({
		success: true,
		books,
	});
});

/** Route to update the timesRead of the book by 1 */
router.post('/update-timesread', async (req, res) => {
	const book = await Book.findById(req.body.id);
	console.log(req.body.id);

	// if no book found return
	if (!book) {
		return res.status(200).json({
			success: false,
			message: 'Book not found',
		});
	}

	book.timesRead += 1;
	try {
		await book.save();
		res.status(200).json({
			success: true,
			message: 'Times read updated successfully',
		});
	} catch (err) {
		res.status(200).json({
			success: false,
			message: 'Error updating times read',
		});
	}
});

module.exports = router;
