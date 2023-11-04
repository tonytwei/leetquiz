const express = require('express');
const router = express.Router();
const Question = require('../../client/models/question'); // Assuming your model is in a 'models' folder

let defaultQuestionID = "0242";
router.get('/', async (req, res) => {
	try {
		const data = require(`../../client/public/assets/questions/${defaultQuestionID}.json`);
		res.render('quiz', { data });
	} catch (error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
});

router.get('/get-questions', (req, res) => {
    const difficulty = req.query.difficulty.split(','); // Split the comma-separated values into an array
    const topics = req.query.topics.split(','); // Split the comma-separated values into an array
    const set = req.query.set;
  
    Question.find({
        difficulty: { $in: difficulty },
        topics: { $in: topics}
    })
        .select('id title difficulty')
        .exec()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
});


// temp routes
router.get('/add-question', (req, res) => {
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

router.get('/all-questions', (req, res) => {
	Question.find()
		.then((result) => {
			res.send(result);
		})
		.catch((err) => {
			console.log(err);
		});
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  Question.findOne({ id: id })
    .select('id title difficulty')
    .exec()
    .then((result) => {
      if (result) {
        res.send(result);
      } else {
        res.status(404).send('Question not found');
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Internal Server Error');
    });
});

module.exports = router;