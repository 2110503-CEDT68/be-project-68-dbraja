const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    address : {
        type: String,
        required: [true, 'Please add an address']
    },
    website : {
        type: String,
        match: [
            /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
            'Please add a valid website URL'
        ]
    },
    description : {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description can not be more than 500 characters']
    },
    tel : {
        type: String,
        required: [true, 'Please add a telephone number'],
        unique: true,
        trim: true,
    },
},{
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
});

//Peverse populate with virtuals
CompanySchema.virtual('registrations', {
    ref: 'Registration',
    localField: '_id',
    foreignField: 'company',
    justOne: false
});

module.exports = mongoose.model('Company', CompanySchema);