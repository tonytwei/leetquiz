const express = require('express');
const path = require('path');
const app = express();
const port = 3005;

app.listen(port);

app.get('/', (req, res) => {
	const filePath = path.join(__dirname, '../client/public/index.html');
	res.sendFile(filePath);
});

app.get('/quiz', (req, res) => {
	const filePath = path.join(__dirname, '../client/pages/quiz.html');
	res.sendFile(filePath);
});

// 404 page, must be at bottom
app.use((req, res) => {
	const filePath = path.join(__dirname, '../client/pages/404.html');
	res.status(404).sendFile(filePath);
});