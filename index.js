const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session'); // Imported for dealing with login sessions
const KnexSessionStore = require('connect-session-knex')(session); // Imported for creating login session tables to store sessions
const db = require('./database/dbConfig');

const welcomeRouter = require('./api/welcome/welcome-router');
const usersRouter = require('./api/users/users-router');

const server = express();
const port = process.env.PORT || 8000;

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use(session({
	resave: false, // avoids recreating sessions that have not changed
	saveUninitialized: false,
	secret: 'secrets are necessary',
	store: new KnexSessionStore({
		knex: db, // configured instance of Knex, or the live database connection
		createtable: true, // if the session table does not exist, create it
	}),
}));

server.use('/api',welcomeRouter);
server.use('/api',usersRouter);

server.use((err, req, res, next) => {
	console.log(err);

	res.status(500).json({
		message: 'Something went wrong!',
	});
})

server.get('/', (req, res) => {
	res.send(`The server is running at http://localhost:${port}`);
})

server.listen(port, () => {
	console.log(`Running at http://localhost:${port}`);
})