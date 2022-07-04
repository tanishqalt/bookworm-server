/**
 *
 * This is a user router. It is used to perform any user related tasks.
 *
 */

const express = require('express');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/UserModel');

/*
 * @route   POST /user/register
 * @desc    Register a new user
 */
router.post('/register', async (req, res) => {
	// check if user has username, password, email
	if (!req.body.username || !req.body.password || !req.body.email) {
		return res.status(200).json({
			success: false,
			message: 'Please provide username, password, and email',
		});
	}

	// use bcryptjs to hash the password
	const hashedPassword = await bcrypt.hash(req.body.password, 10);
	console.log(hashedPassword);

	try {
		const user = new User({
			username: req.body.username,
			password: hashedPassword,
			email: req.body.email,
			bio: req.body.bio,
			readingList: req.body.readingList,
			userType: req.body.userType,
		});

		// save it to the database
		const newUser = await user.save();

		res.send({
			newUser,
			message: 'User created successfully',
			success: true,
		});
	} catch (err) {
		res.status(200).send({
			error: err.message,
			success: false,
		});
	}
});

/**
 * Login endpoint
 */

router.post('/login', async (req, res) => {
	// check if user has username and password
	if (!req.body.username || !req.body.password) {
		return res.status(200).json({
			success: false,
			message: 'Please provide username and password',
		});
	}

	// find the user
	const user = await User.findOne({ username: req.body.username });

	// if user doesn't exist
	if (!user) {
		return res.status(200).json({
			success: false,
			message: 'User does not exist',
		});
	}

	// check if password is correct
	const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

	if (!isPasswordValid) {
		return res.status(200).json({
			success: false,
			message: 'Password is incorrect',
		});
	}

	// create a token
	const token = jwt.sign(
		{
			username: user.username,
			userType: user.userType,
		},
		JWT_SECRET,
		{
			expiresIn: '1h',
		}
	);

	// send the token to the client
	res.status(200).json({
		success: true,
		user: user,
		message: 'User logged in successfully',
		token,
	});
});

/**
 * A router that takes in the JWT token and verifies it
 */

router.post('/verify', async (req, res) => {
	// check if user has token
	if (!req.body.token) {
		return res.status(200).json({
			success: false,
			message: 'Please provide a token',
		});
	}

	// verify the token
	try {
		const decoded = jwt.verify(req.body.token, JWT_SECRET);
		res.status(200).json({
			success: true,
			message: 'Token verified successfully',
			decoded,
		});
	} catch (err) {
		res.status(200).json({
			success: false,
			message: 'Token is invalid',
		});
	}
});

/**
 * A router that returns all the users, for the library admin
 */

router.get('/all-users', async (req, res) => {
	const users = await User.find();
	res.status(200).json({
		success: true,
		users,
	});
});

/**
 * A router that returns a user by their username
 */

router.post('/get-user', async (req, res) => {
	const user = await User.findOne({ username: req.body.username });

	if (!user) {
		return res.status(200).json({
			success: false,
			message: 'User does not exist',
		});
	}

	res.status(200).json({
		success: true,
		user,
	});
});

/**
 * A router that updates a user's bio
 */

router.post('/update-userbio', async (req, res) => {
	const user = await User.findOne({ username: req.body.username });

	if (!user) {
		return res.status(200).json({
			success: false,
			message: 'User does not exist',
		});
	}

	user.bio = req.body.bio;

	await user.save();

	res.status(200).json({
		success: true,
		message: 'User updated successfully',
		user,
	});
});

/**
 * A router that updates a user's reading list
 */

router.post('/update-user-readinglist', async (req, res) => {
	const user = await User.findOne({ username: req.body.username });

	if (!user) {
		return res.status(200).json({
			success: false,
			message: 'User does not exist',
		});
	}

	// get the book from the body
	const book = req.body.book;

	// check if the book is already in the reading list - loop through the reading list, and see if the key id is the same as the book id
	for (let i = 0; i < user.readingList.length; i++) {
		if (user.readingList[i].isbn === book.isbn) {
			return res.status(200).json({
				success: false,
				message: 'Book already in reading list',
				user: user,
			});
		}
	}

	// add the book to the reading list
	user.readingList.push(book);

	// save the user
	await user.save();

	res.status(200).json({
		success: true,
		message: 'User updated successfully',
		user: user,
	});
});

module.exports = router;
