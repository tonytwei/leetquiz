const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

// connect to mongodb
const port = process.env.PORT || 3005;
const dbURI = process.env.DB_URI;
mongoose.connect(dbURI)
	.then((result) => {
		app.listen(port)
		console.log("Connected to db and listening on port " + port);
	})
	.catch((err) => console.log(err));

// express config
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client/pages'));
app.use(express.static(path.join(__dirname, '../client/public')));

// routes
const quizRoute = require('./routes/quiz');
app.use('/quiz', quizRoute);

app.get('/', (req, res) => {
	res.render('index');
});

// 404 page, must be at bottom
app.use((req, res) => {
	res.status(404).render('404');
});