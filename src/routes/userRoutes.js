const bcrypt = require('bcrypt');
const express = require('express');
const getLoggedInUserData = require('../middleware/getLoggedInUserData');
const User = require('../database/models/User');
const requestService = require('../requestService');
const tokenService = require('../shared/tokenService');

const userRouter = express.Router();

userRouter.get('/profile', getLoggedInUserData, async (req, res, next) => {
	return await requestService.handleRequest(req, res, next, async () => {
		res.status(200).send(req.user);
	});
});

userRouter.post('/sign-up', async (req, res, next) => {
	return await requestService.handleRequest(req, res, next, async () => {
		const {
			email,
			password,
			name,
		} = req.body || {};

		if (!email && !password) {
			return res.status(400).send({ error: true, code: 400, message: 'Email and password must be provided' });
		}

		// @TODO: Make sure email is valid

		const userAlreadyExists = !!(await User.findOne({ email }));

		if (userAlreadyExists) {
			return res.status(409).send({ error: true, code: 409, message: 'Email already in use' });
		}

		const encryptedPassword = await bcrypt.hash(password, 10);
		const user = new User({ email, name, password: encryptedPassword });
		const result = await user.save();

		return res.status(201).send({ code: 201, message: 'User created successfully', userId: result._id });
	});
});

userRouter.post('/login', async (req, res, next) => {
	return await requestService.handleRequest(req, res, next, async () => {
		const {
			email,
			password,
		} = req.body || {};

		if (!email && !password) {
			return res.status(400).send({ error: true, code: 400, message: 'Email and password must be provided' });
		}

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).send({ error: true, code: 400, message: 'Email and password combination is invalid.' });
		}

		const isCorrectPassword = await bcrypt.compare(password, user.password);

		if (!isCorrectPassword) {
			return res.status(400).send({ error: true, code: 400, message: 'Email and password combination is invalid' });
		}

		const token = tokenService.createUserToken({ email: user.email, name: user.name });

		return res.status(200).send({ code: 200, token });
	});
});

module.exports = userRouter;
