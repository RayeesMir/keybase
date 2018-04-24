'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const log = console.log;
const logError = console.log;

module.exports = {
    connect: (url) => {

        //Connect to database
        mongoose.connect(url).then(con => log("Connected to ", url)).catch(error => console.error("Unable to connect"));

        // CONNECTION EVENTS
        // If the connection throws an error
        mongoose.connection.on('error', error => logError('Mongoose connection error: ' + error));

        // When the connection is disconnected
        mongoose.connection.on('disconnected', () => log('Mongoose connection disconnected'));

        // If the Node process ends, close the Mongoose connection 
        process.on('SIGINT', () => {
            mongoose.connection.close(() => {
                log('Mongoose connection disconnected through app termination');
                process.exit(0);
            });
        });

    },
    disconnect: () => {
        mongoose.connection.close(() => {
            log('Mongoose connection disconnected through app termination');
            process.exit(0);
        });
    }
};