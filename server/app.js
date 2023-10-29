const express = require('express');
const path = require('path');

const app = express();

const port = 3005;
app.listen(port);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client/pages'));

app.get('/', (req, res) => {
	const filePath = path.join(__dirname, '../client/public/index.html');
	res.sendFile(filePath);
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../client/public')));

let defaultQuestionID = "0217";

app.get('/quiz', async (req, res) => {
	try {
		const filePath = path.join(__dirname, '../client/pages/quiz.ejs');
		const data = require(`../client/public/assets/questions/${defaultQuestionID}.json`);
		res.render(filePath, { data });
	} catch (error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
});
  

// 404 page, must be at bottom
app.use((req, res) => {
	const filePath = path.join(__dirname, '../client/pages/404.html');
	res.status(404).sendFile(filePath);
});