const express = require('express');
require('dotenv').config();// Importing the dotenv library.
const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL;

const { authorize } = require('./auth');
const { mongo } = require('mongoose');
// const z = require('zod');

// what does this line even do ?
const app = express();

// Establishing connection to the database, since it's an async function and will return promise therfore we are using .then and .catch structure. 
mongoose.connect(DB_URL).then(() => console.log("connected to DB")).catch(err => console.error("DB connection error: ",err));


// Middleware to parse json
app.use(express.json());


app.post('/user/signup', authorize('user'), function(req, res) {

});
app.post('/user/signin', authorize('user'), function(req, res) {

});
app.post('/user/purchases', authorize('user'), function(req, res) {

});
app.get('/user/purchases', authorize('user'), function(req, res) {

});

// write the app.use(admin auth middleware here)


app.post('/admin/signup', authorize('admin'), function(req, res) {

});
app.post('/admin/signin', authorize('admin'), function(req, res) {

});
app.delete('/admin/courses', authorize('admin'), function(req, res) {

});
app.put('/admin/courses', authorize('admin'), function(req, res) {

});

app.listen(PORT, ()=> {
    console.log(`server is running on port: ${PORT}`);
});