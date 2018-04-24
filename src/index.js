'use strict';
require('dotenv').config({ path: '.testenv', silent: true });
const app = require('express')();
const bodyParser = require('body-parser');
const db = require('./db');
const routes = require('./routes');
const log = console.log;
const Errors = require('./errors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// connect Database
if (process.env.NODE_ENV === 'development') {
    db.connect(process.env.TEST_MONGODB_URL);
} else {
    db.connect(process.env.PROD_MONGODB_URL);
}
app.get('/', (request, response) => response.json({ message: "Welcome to keybase" }));

app.use('/object', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(new Errors.NotFoundError());
});

//error handler
app.use((err, req, res, next) => {
    log("Error ", err);
    Errors.errorHandler(err, req, res, next);
    // res.statusCode = err.statusCode || 400;
    // res.json(err);
});


const port = process.env.PORT || 3000;

const server = app.listen(port, function() {
    const host = server.address().address;
    log('listening on http://%s:%s', host, process.env.PORT);
});

process.on('uncaughtException', (error) => {
    console.error('Caught exception:', error);
});

process.on('unhandledRejection', (reason, prom) => {
    log('Unhandled Rejection at:', prom, 'reason:', reason);
});

module.exports = app;