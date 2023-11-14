require('dotenv').config();
const express = require('express');
const userRouter = require('./routes/userRoutes');
const requestService = require('./requestService');
require('./database/startConnection').connect().catch(err => console.log(err));

const app = express();

app.use(express.json());

app.use(requestService.logRequest);

app.get('/', async (req, res) => {
	res.send('Hello World!');
});

app.use('/users', userRouter);

app.use(requestService.handleGenericError);

const port = 3000;
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
