const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Catching Uncaught Exceptions
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION!  Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({
    path: './config.env'

});

const app = require('./app');


const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('DB Connection successfull!'));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

//Global All Promise rejection handle
process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});