const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const CourseSchema = new Schema({
    title: {type: String, required: true, unique: true},
    discription: String,
    price: {type:Number, required: true},
    createdby: {type: ObjectId, required: true},
    createdat: {type: Date, default: Date.now}
});

CourseSchema.index({title: 1, createdby: 1}, {unique: true});

const CourseModel = mongoose.model('Course', CourseSchema);

module.exports = {
    CourseModel
}