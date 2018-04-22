import mongoose from 'mongoose';
const keySchema = new mongoose.Schema({
    key: {
        type: String,
        required: [true, 'Key is required'],
        minlength: 1,
        trim: true,
    },
    value: {
        type: String,
        required: [true, 'Value for Key is required'],
        minlength: 1,
        trim: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Key', keySchema);