const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Blog = require('../client/models/blog');
const Question = require('../client/models/question');
const app = express();

// connect to mongodb
const port = 3005;
const dbURI = 'REPLACE'; // modified dbURI
mongoose.connect(dbURI)
	.then((result) => app.listen(port))
	.catch((err) => console.log(err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client/pages'));

app.use(express.static(path.join(__dirname, '../client/public')));

// question routes
// TODO: remove later, temp 
app.get('/add-question', (req, res) => {
	const data = require(`../client/public/assets/questions/0242.json`);
	const question = new Question(data);

	question.save()
		.then((result) => {
			res.send(result);
		})
		.catch((err) => {
			console.log(err);
		});
});

app.get('/all-questions', (req, res) => {
	Question.find()
		.then((result) => {
			res.send(result);
		})
		.catch((err) => {
			console.log(err);
		});
});

app.get('/quiz/:id',  (req, res) => {
	const id = req.params.id;
	console.log(id);
	Question.findById(id)
		.then((result) => {
			const data = result;
			res.render('quiz', { data })
		})
		.catch((err) => {
			console.log(err);
		});
})


// original routes
app.get('/', (req, res) => {
	res.render('index');
});

let defaultQuestionID = "0217";
app.get('/quiz', async (req, res) => {
	try {
		const data = require(`../client/public/assets/questions/${defaultQuestionID}.json`);
		res.render('quiz', { data });
	} catch (error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
});

// 404 page, must be at bottom
app.use((req, res) => {
	res.status(404).render('404');
});