const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const BookRequest = require('../models/BookRequestModel');

/**
 * Router to create a request for a book
 */

router.post('/new', async (req, res) => {
	const user = await User.findOne({ username: req.body.username });
	if (!user) {
		return res.status(200).json({
			success: false,
			message: 'User does not exist',
		});
	}

	try {
		const requestBook = new BookRequest({
			username: req.body.username,
			bookTitle: req.body.bookTitle,
			bookAuthor: req.body.bookAuthor,
			status: 'pending',
		});

		await requestBook.save();

		res.status(200).json({
			success: true,
			message: 'Request created successfully',
		});
	} catch (err) {
		res.status(200).json({
			success: false,
			message: 'Error creating request',
		});
	}
});

/**
 * Get all requests
 */

router.get('/all', async (req, res) => {
	const requests = await BookRequest.find();
	res.status(200).json({
		success: true,
		requests,
	});
});

module.exports = router;
