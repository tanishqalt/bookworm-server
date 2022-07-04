/**
 * Generate a basic express app, enable cors, and set the port
 */

const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 3000;
const router = express.Router();
const connectWithDatabase = require('./dbConnect');
const dotenv = require('dotenv');
const requestRouter = require('./routes/requestRouter');
const bookRouter = require('./routes/bookRouter');

dotenv.config();

// Get the routers
const userRouter = require('./routes/userRouter');

const app = express();
// Enable cors
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connectWithDatabase();


app.use('/', router);
router.use('/user', userRouter);
router.use('/request', requestRouter);
router.use('/books', bookRouter);

// start the server
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});