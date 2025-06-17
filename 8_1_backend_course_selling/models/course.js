const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const CourseSchema = new Schema({
    title: {type: String, required: true, unique: true},
    discription: String,
    price: {type:number, required: true},
    createdby: {type: ObjectId, required: true},
    createdat: {type: Date, default: Date.now}
});


const CourseModel = mongoose.Model('Course', CourseSchema);

module.exports = {
    CourseModel
}