const jwt = require('jsonwebtoken');

const createUserToken = (simpleUserData) => {
	return jwt.sign(simpleUserData, process.env.JWT_SECRET);
};

const verifyUserToken = (token) => {
	return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
	createUserToken,
	verifyUserToken,
};
