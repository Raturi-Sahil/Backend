const mongoose = require('mongoose');

// export the class Schema of mongoose to define the schema
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;




const user = new Schema({
    name: String, 
    email: {type: String, unique: true},
    password: String
});

const todo = new Schema({
    userId: ObjectId,
    title: String,
    done: Boolean
});

// const user and const todo shows the schema, users/todos shows the collection where u wanna put your data in.
// mongoose.model let's u put data using UserModel.insert(), at users collection with user schema. 
const UserModel = mongoose.model('users', user);
const TodoModel = mongoose.model('todos', todo);

module.exports = {
    UserModel,
    TodoModel
};