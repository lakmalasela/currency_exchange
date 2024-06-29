const mongoose = require('mongoose');

const CountrySchema = new mongoose.Schema({
    countryname:{
        type: String,
        required: true
    },
    code:{
        type: String,
        required: true
    }
     
},

{
    timestamps: true,
    toObject: {
        virtuals: true,
    },
    toJSON: {
        virtuals: true,
    }
}
);

module.exports = mongoose.model("Country",CountrySchema)
