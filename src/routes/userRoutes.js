const express = require('express');
const getLoggedInUserData = require('../middleware/getLoggedInUserData');

const userRouter = express.Router();

userRouter.get('/profile', getLoggedInUserData, async (req, res) => {
	res.status(200).send('User data');
});

module.exports = userRouter;
