const express = require('express');
require('dotenv').config();// Importing the dotenv library.
const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL;

const { authorize } = require('./auth');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { UserModel } = require('./models/user');
const { JWT_SECRET } = require('../7_2_password_auth/auth');

// const z = require('zod');

// what does this line even do ?
const app = express();

// Establishing connection to the database, since it's an async function and will return promise therfore we are using .then and .catch structure. 
mongoose.connect(DB_URL).then(() => console.log("connected to DB")).catch(err => console.error("DB connection error: ",err));


// Middleware to parse json
app.use(express.json());


app.post('/signup', async function(req, res) {
    try{
        const {username, email, password, role} = req.body;
        if(!username || !email || !password || !role)
        return res.status(400).json({msg: "All fields are required"});

        const user = await UserModel.findOne({email});

        if(user)
        return res.status(409).json({msg: "user already exists"});

        //Hashing using bcrypt
        const hashedPassword = await bcrypt.hash(password, 4);

        const response = await UserModel.create({username, email, password: hashedPassword, role});

        if(!response)
        return res.status(500).json({msg: "User creation failed, please try again later"});

        res.status(200),json({msg: "You are signed up successfully"});

    } catch(error) {
        if(error.code === 11000 && error.keyPattern?.email)
            return res.status(409).json({msg: "Email already in use"});

        return res.status(500).json({msg: "An unexpected error occured during signup"});
    }

});
app.post('/signin', async function(req, res) {
    try {
        const {email, password} = req.body;

        //check if all input fields
        if(!email || !password)
            return res.status(400).json({msg: "All fields are required"});

        //fetch the user via just the email
        const user = await UserModel.findOne({email});

        //if the user doesn't exist then simply return
        if(!user)
            return res.status(409).json({msg: "Invalid credentials"});

        //Password authentication
        const passwordMatch = await bcrypt.compare(password, user.password);

        //if password auth fails then just return
        if(!passwordMatch) return res.status(409).json({msg: "Invalid creadentials"});

        //if the user exists we go on to create a token through jsonwebtoken library.
        const autherization = jwt.sign({id: user._id}, JWT_SECRET);

        //if tokne creation fails then return
        if(!autherization)
            return res.status(500).json({msg: "An error occured during sign in, please try again later"});
        
        res.status(201).json({msg: "You are successfully signed in", autherization});


    }catch(error) {
        console.error(error);
        res.status(500).json({msg: "An error occured during sign in, please try again later"});
    }   
});


app.post('/user/courses', authorize('user'), function(req, res) {
    // this  endpoint shows all courses available for a user to purchase.
});
app.post('/user/purchases', authorize('user'), function(req, res) {
    //this endpoint let's a user make a purchase. 
});
app.get('/user/purchases', authorize('user'), function(req, res) {
    //this endpoint shows all the purchases a user has made.
});


app.delete('/admin/courses/:courseId', authorize('admin'), function(req, res) {
    // this endpoint let's an admin delete a course.
});
app.post('/admin/courses', authorize('admin'), function(req, res) {
    // this endpoint let's an admin create a new course. 
});
app.put('/admin/courses/:courseId', authorize('admin'), function(req, res) {
    // this endpoint let's an admin update a course. 
});
app.get('/admin/courses', authorize('admin'), function(req, res) {
    // this endpoint let's an admin to fetch all the courses they have created. 
});

app.listen(PORT, ()=> {
    console.log(`server is running on port: ${PORT}`);
});