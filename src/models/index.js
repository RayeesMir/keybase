'use strict';
const mongoose = require('mongoose');
const KeySchema = new mongoose.Schema({
    key: {
        type: String,
        required: [true, 'Key is required'],
        minlength: 1,
        trim: true,
        index: true
    },
    value: {
        type: String,
        required: [true, 'Value for Key is required'],
        minlength: 1,
        trim: true,
    },
    timestamp: {
        type: Number,
        default: Date.now
    }
});

/**
 * @param {String} key 
 * @param {Number} timestamp 
 * @returns Object matching condition
 */

KeySchema.statics.findKey = function(key, timestamp) {

    if (key && timestamp) {
        return this.findOne({ key: key }).select('-_id value').where({ 'timestamp': { $lte: (timestamp) } }).sort({ timestamp: 'desc' }).lean();
    } else if (key) {
        return this.findOne({ key: key }).select('-_id value').sort({ timestamp: 'desc' }).lean();
    }
};

module.exports = mongoose.model('Key', KeySchema);