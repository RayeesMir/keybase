'use strict';

class BaseError extends Error {

    constructor(statusCode, errorCode, message, opts) {
        super(message);

        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.opts = opts;
        Error.captureStackTrace(this, BaseError);
    }

    /**
     * This method is used to create Error Format 
     * 
     * @returns 
     * @memberof BaseError
     */

    render() {
        return {
            status: {
                code: this.statusCode,
                message: this.message
            },
            response: {
                code: this.errorCode,
                opts: this.opts
            }
        };
    }
}

/**
 * Creates Not Found Error to be sent to user
 * @class NotFoundError
 * @extends {BaseError}
 */

class NotFoundError extends BaseError {

    constructor(message) {
        super(404, 'NotFound', message);
    }
}

/**
 * Creates BadRequest Error to be sent to user
 * 
 * @class BadRequestError
 * @extends {BaseError}
 */

class BadRequestError extends BaseError {

    constructor(message) {
        super(400, 'BadRequest', message);
    }
}

/**
 * @class UnknownError
 * @extends {BaseError}
 */

class UnknownError extends BaseError {

    constructor(error, opts) {
        super(500, 'Unknown', error.toString(), opts);
        this.innerError = error;
    }
}
/**
 * For Internal Server Error
 * @class InvalidState
 * @extends {BaseError}
 */
class InvalidState extends BaseError {

    constructor(error, opts) {
        super(500, 'InvalidState', error.toString(), opts);
        this.innerError = error;
    }
}
/**
 * This method replies to user with exact error 
 * 
 * @param {Object} err 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Callback Function} next 
 * @returns JSON TO USER
 */
const errorHandler = (err, req, res, next) => {
    let error = err;
    const opts = getOpts(req);

    if (err instanceof BaseError) {
        error.opts = Object.assign(opts, error.opts);
    } else {
        error = new UnknownError(err, opts);
        console.error(error);
    }
    console.error(error);
    return res.status(error.statusCode).send(error.render());
};


const getOpts = (req) => {
    return {
        payload: JSON.stringify({
            query: req.query,
            body: req.body,
            params: req.params
        }),
        headers: JSON.stringify(req.headers),
        url: req.originalUrl || null
    };
};

module.exports = {
    NotFoundError: NotFoundError,
    BadRequestError: BadRequestError,
    UnknownError: UnknownError,
    InvalidState: InvalidState,
    errorHandler: errorHandler
};