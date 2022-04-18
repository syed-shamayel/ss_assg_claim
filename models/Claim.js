const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ClaimSchema = new Schema({
    claimId: {
        type: String,
        required: true
    },
    claimAmount: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    policyId: {
        type: String,
        required: true
    },
    billingId: {
        type: String,
        required: false
    },
});

module.exports = Claim = mongoose.model('claim', ClaimSchema);