const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const PurchaseSchema = new Schema({
    userId: {type: ObjectId, ref: 'User', required: true},
    courseId: {type: ObjectId, ref: 'Course', required: true},
    purchaseDate: {type: Date, default: Date.now},
    validTill: {type: Date, default: function() {
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear()+1);
    }}
});


const PurchaseModel = mongoose.model('Purchase', PurchaseSchema);

module.exports = {
    PurchaseModel
}