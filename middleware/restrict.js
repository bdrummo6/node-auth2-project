function restrict() {
	const error = {
		message: 'You shall not pass!',
	}

	return async (req, res, next) => {
		try {

			if (!req.session || !req.session.user) {
				return res.status(401).json(error);
			}

			next();
		} catch (err) {
			next(err);
		}
	}
}

module.exports = restrict;