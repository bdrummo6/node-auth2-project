const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const welcomeRouter = require('./api/welcome/welcome-router');
const usersRouter = require('./api/users/users-router');

const server = express();
const port = process.env.PORT || 8000;

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(cookieParser());

server.use('/api', welcomeRouter);
server.use('/api', usersRouter);

server.use((err, req, res, next) => {
	console.log(err)

	res.status(500).json({
		message: 'Something went wrong',
	});
})

server.listen(port, () => {
	console.log(`Running at http://localhost:${port}`)
})