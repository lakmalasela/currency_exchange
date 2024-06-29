const mongoose = require('mongoose');

const TransferSchema = new mongoose.Schema({
    fromcountryname:{
        type: String,
        required: true
    },
    tocountryname:{
        type: String,
        required: true
    },
    amount:{
        type: Number,
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

module.exports = mongoose.model("Transfer",TransferSchema)
