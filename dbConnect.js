const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://tanishqsh:rP9Nl2NM1P1pY3m8@bookworm.qm6xx.mongodb.net/?retryWrites=true&w=majority';

const connectWithDatabase = async () => {
	try {
		await mongoose.connect(MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('Database Connected Successfully.');
	} catch (e) {
		console.log(e);
	}
};

module.exports = connectWithDatabase;