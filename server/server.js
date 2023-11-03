const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Blog = require('../client/models/blog');
const Question = require('../client/models/question');
const app = express();
require('dotenv').config();

// connect to mongodb
const port = process.env.PORT || 3000;
const dbURI = process.env.DB_URI;
mongoose.connect(dbURI)
	.then((result) => app.listen(port))
	.catch((err) => console.log(err));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client/pages'));
app.use(express.static(path.join(__dirname, '../client/public')));



// mongodb question routes, still being worked on
app.get('/add-question', (req, res) => {
	const data = require(`../client/public/assets/questions/0217.json`);
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
	Question.findOne({ id: id })
		.then((result) => {
			if (result) {
				const data = result;
				res.render('quiz', { data })
			} else {
				res.status(404).send('Question not found');
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send('Internal Server Error');
		});
})

const difficulties = ["Easy", "Medium"];
const topics = ["Arrays"];
Question.find({
	difficulty: { $in: difficulties },
	topics: { $in: topics}
})
	.select('id title difficulty')
	.exec()
	.then((result) => {
		console.log(result);
	})
	.catch((err) => {
		console.log(err);
	});










// oringinal ejs routes
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