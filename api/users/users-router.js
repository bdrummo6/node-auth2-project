const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('./users-model');
const restrict = require('../../middleware/restrict');

const router = express.Router();

router.get('/users', restrict(0), async (req, res, next) => {
	try {
		res.json(await Users.find());
	} catch(err) {
		next(err);
	}
})

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
			message: `Welcome ${user.username}!`,
		});
	} catch(err) {
		next(err);
	}
})

module.exports = router;