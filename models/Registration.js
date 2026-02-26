const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
    apptDate: {
        type: Date,
        required: [true, 'Please add a date for the interview'],
        min: ['2022-05-10T00:00:00.000Z', 'Date cannot be before May 10th, 2022'],
        max: ['2022-05-13T23:59:59.000Z', 'Date cannot be after May 13th, 2022']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        type: mongoose.Schema.ObjectId,
        ref: 'Company',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Registration', RegistrationSchema);