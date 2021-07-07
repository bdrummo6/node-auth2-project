const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('./users-model');
const restrict = require('../../middleware/restrict');

const router = express.Router();

// Returns all users in the database for users in the IT and admin departments
router.get('/users', restrict('IT'), async (req, res, next) => {
	try {
		res.json(await Users.find());
	} catch(err) {
		next(err);
	}
})

// Creates a new user in the database
router.post('/register', async (req, res, next) => {
	try {
		const { username, password, department } = req.body;
		const user = await Users.findBy({ username }).first();

		if (user) {
			return res.status(409).json({
				message: 'Username is already taken',
			});
		}

		const newUser = await Users.add({
			username,
			department,
			password: await bcrypt.hash(password, 14),
		})

		res.status(201).json(newUser);
	} catch(err) {
		next(err);
	}
})

// Creates a login session for a user
router.post('/login', async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const user = await Users.findBy({ username }).first();

		if (!user) {
			return res.status(401).json({
				message: 'You shall not pass!',
			});
		}

		const passwordValid = await bcrypt.compare(password, user.password);

		if (!passwordValid) {
			return res.status(401).json({
				message: 'You shall not pass!',
			});
		}

		const payload = {
			id: user.id,
			username: user.username,
			department: user.department,
		}

		res.cookie('token', jwt.sign(payload, process.env.JWT_SECRET));

		res.json({
			message: `Welcome ${user.username} from the ${user.department} department!`,
		});
	} catch(err) {
		next(err);
	}
})

// Logs user out
router.get('/logout', async (req, res, next) => {
	res.clearCookie('token');
	res.send('You have successfully logged out!')
})

module.exports = router;