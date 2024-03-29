const express = require('express');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const keys = require('./config/keys');
const passport = require('passport');
const passportSetup = require('./config/passport-setup');

// connect to mongodb
const port = 3000;
const dbURI = keys.mongodb.dbURI;
mongoose.connect(dbURI)
	.then((result) => {
		app.listen(port);
		console.log("Connected to db and listening on port " + port);
	})
	.catch((err) => console.log(err));

// express config
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client/pages'));
app.use(express.static(path.join(__dirname, '../client/public')));
app.use(session({
	secret: keys.session.cookieKey,
	resave: false,
	saveUninitialized: false,
	cookie: { secure: false } // set to true if your app is on https
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// routes
const quizRoute = require('./routes/quiz');
app.use('/quiz', quizRoute);
const accountRoute = require('./routes/account');
app.use('/account', accountRoute);
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);


// default pages
app.get('/', (req, res) => {
	res.render('index');
});

// 404 must be at bottom
app.use((req, res) => {
	res.status(404).render('404');
});
