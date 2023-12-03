const router = require('express').Router();
const Question = require('../../client/models/question');
const User = require('../../client/models/user')

router.get('/', async (req, res) => {
	// default question rendered server side
	console.log('quiz//User ID:', req.session.userId);
	const defaultQuestionID = "242";
	Question.find({ id: defaultQuestionID })
		.exec()
		.then((result) => {
			let questionData = result[0];
			res.render('quiz', { questionData: questionData});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send('Internal Server Error');
		});
});

router.get('/filter-questions', (req, res) => {
	const difficulty = req.query.difficulty.split(',');
	const topics = req.query.topics.split(',');
	const set = req.query.set;
  
	let filter = {
		difficulty: { $in: difficulty },
		topics: { $in: topics}
	};
	if (set && set !== 'all' && set !== 'custom') {
		filter.sets = { $in: [set]};
	}

	Question.find(filter)
		.select('id title difficulty')
		.exec()
		.then((result) => {
			const order = ['Easy', 'Medium', 'Hard'];
            result.sort((a, b) => order.indexOf(a.difficulty) - order.indexOf(b.difficulty));
			res.send(result);
		})
		.catch((err) => {
			console.log(err);
		});
});

router.get('/get-question', (req, res) => {
	const questionID = req.query.id;
	Question.find({ id: questionID })
		.exec()
		.then((data) => {
			res.send(data[0]);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send('Internal Server Error');
		});
});

router.get('/fetch-cookie', async (req, res) => {
	const userID = req.session.userId;
	User.findById(userID)
		.exec()
		.then((data) => {
			if (!data) {
				console.log('User not found');
				res.status(203).send('User not found');
			} else {
				res.send(data.questionCookie);
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send('Internal Server Error');
		});
});


// temp routes
// TODO: del later
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