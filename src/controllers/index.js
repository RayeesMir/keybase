const Keys = require('../models');
const Errors = require('../errors');
'use strict';
module.exports = {
    saveToStore: (request, response, next) => {
        const payload = request.body;
        const key = Object.keys(payload)[0];
        const value = Object.values(payload)[0];

        // check if both key and value are present
        if (key && value) {
            Keys.create({ key, value })
                .then(result => {
                    //get timestamp from result
                    const { timestamp } = result;
                    response.status(201).json({ key, value, timestamp });
                })
                .catch(err => next(err));
        } else {
            // payload is empty
            return next(new Errors.BadRequestError('Bad request'));
        }
    },
    getFromStore: (request, response, next) => {
        const key = request.params.key;
        let timestamp = request.query.timestamp;
        let promise;

        if (key && timestamp == undefined) {
            promise = Keys.findKey(key);
        } else {
            timestamp = parseInt(timestamp);
            if (timestamp) {
                promise = Keys.findKey(key, timestamp);
            } else {
                return next(new Errors.BadRequestError('Bad request'));
            }
        }
        promise
            .then((result) => {
                if (result) {
                    response.status(200).json(result);
                } else {
                    // if no result found return error 404
                    return next(new Errors.NotFoundError('Not found'));
                }
            })
            .catch((error) => {
                next(error);
            });
    }
};