const requestService = require('../requestService');
const { verifyUserToken } = require('../shared/tokenService');

const getLoggedInUserData = async (req, res, next) => {
	return await requestService.handleRequest(req, res, next, async () => {
		if (!req.header('Authorization')) {
			return res.status(401).send({ error: true, code: 401, message: 'Authentication required' });
		}
		const token = req.header('Authorization').replace('Bearer ', '');
		const decodedToken = verifyUserToken(token);
		req.user = decodedToken;

		return next();
	});
};

module.exports = getLoggedInUserData;
