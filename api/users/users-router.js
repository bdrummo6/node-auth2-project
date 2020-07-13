const express = require('express');
const bcrypt = require('bcryptjs');
const Users = require('./users-model');
const restrict = require('../../middleware/restrict');

const router = express.Router();

// Retrieves list of users from database
router.get('/users', restrict(), async (req, res, next) => {
	try {
		res.json(await Users.find());
	} catch(err) {
		next(err);
	}
})

// Adds a new user to the database
router.post('/register', async (req, res, next) => {
	try {
		const { username, password, department } = req.body;
		const user = await Users.findBy({ username }).first();

		if (user) {
			return res.status(409).json({
				message: 'Username already exists!',
			});
		}

		const newUser = await Users.add({
			username,
			password: await bcrypt.hash(password, 12), // hash the password with a time complexity of '12'
			department
		})


		res.status(201).json(newUser);
	} catch(err) {
		next(err);
	}
})

// Creates new user session so user can access list of users
router.post('/login', async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const user = await Users.findBy({ username }).first();

		if (!user) {
			return res.status(401).json({
				message: 'You shall not pass!',
			});
		}

		// hash the password again and see if it matches what we have in the database
		const passwordIsValid = await bcrypt.compare(password, user.password)

		if (!passwordIsValid) {
			return res.status(401).json({
				message: 'You shall not pass!',
			});
		}

		req.session.user = user;

		res.json({
			message: `${user.username} is logged in!`,
		});
	} catch(err) {
		next(err);
	}
})

// Ends user's session
router.get('/logout', async (req, res, next) => {
	try {
		req.session.destroy((err) => {
			if (err) {
				next(err);
			} else {
				res.status(204).end();
			}
		})
	} catch (err) {
		next(err);
	}
})


module.exports = router;