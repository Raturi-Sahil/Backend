const express = require('express');
require('dotenv').config();// Importing the dotenv library.
const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL;

const { authorize } = require('./auth');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { UserModel } = require('./models/user');
const { CourseModel } = require('./models/course');
const { PurchaseModel } = require('./models/purchase');
const jwt = require('jsonwebtoken');
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

        res.status(201).json({msg: "You are signed up successfully"});

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
            return res.status(401).json({msg: "Invalid credentials"});

        //Password authentication
        const passwordMatch = await bcrypt.compare(password, user.password);

        //if password auth fails then just return
        if(!passwordMatch) return res.status(401).json({msg: "Invalid credentials"});

        //if the user exists we go on to create a token through jsonwebtoken library.
        const authorization = jwt.sign({id: user._id}, JWT_SECRET);

        //if tokne creation fails then return
        if(!authorization)
            return res.status(500).json({msg: "An error occured during sign in, please try again later"});
        
        res.status(201).json({msg: "You are successfully signed in", authorization});


    }catch(error) {
        console.error(error);
        return res.status(500).json({msg: "An error occured during sign in, please try again later"});
    }   
});


app.get('/courses', authorize('user'), async function(req, res) {
    try {
        // this endpoint shows all courses available for a user to purchase.
        const courses = await CourseModel.find();// fetch all the course.

        if(!courses || courses.length == 0)
            return res.json({msg: "No course availabel"}); 

        res.status(200).json(courses);// send to the frontend.
    }catch(error) {
        console.error(error);
        res.status(500).json({msg: "An error occured during fetching the courses"})
    }
});

app.post('/user/purchases', authorize('user'), async function(req, res) {
    try {
        //this endpoint let's a user make a purchase. 
        const userId = req.userId;
        const courseId = req.body.courseId;

        if(!courseId)
            return res.status(400).json({msg: "Invalid input"});

        const existingPurchase = await PurchaseModel.find({userId, courseId});
        if(existingPurchase)
            return res.status(409).json({msg: "Course already purchased"});

        const purchase = await PurchaseModel.create({userId, courseId});

        if(!purchase || purchase.length == 0)
            return res.status(500).json({msg: "An error occured during purchase"});

        res.status(201).json({msg: "Transaction successful", purchase});
    } catch(error) {
        console.error(error);
        return res.status(500).json({msg: "Internal server error"});
    }
});
app.get('/user/purchases', authorize('user'),async function(req, res) {
    try {
        //this endpoint fetches all the purchased courses of a user. 
        const userId = req.userId;
        const purchases = await PurchaseModel.findOne({userId});
        res.status(200).json(purchases);
    } catch(error) {
        res.status(500).json({msg: "Internal server error"});
    }
});


app.delete('/admin/courses/:id', authorize('admin'), async function(req, res) {
    // this endpoint let's an admin delete a course.
    try {
        const courseId = req.params.id;
        // no need to check for course id, if it hadn't been there then the requiest wouldn't have hit this endpoint.

        const response = await CourseModel.findByIdAndDelete(courseId);
        
        if(!response)
            res.status(404).json({msg: "Course not found"});

        // res.status(204).json({msg: "Course successfully deleted", response}); if you keep it 204 then don't send a body, else make it 200 and send a body with it. 
        res.status(200).json({msg: "Course successfully deleted"});
    }catch(error) {
        console.error(error);
        return res.status(500).json({msg: "Internal server error"});
    }

});
app.post('/admin/courses', authorize('admin'), async function(req, res) {
    try {
            // this endpoint let's an admin create a new course. 
        const userId = req.userId;
        const { title, description, price } = req.body;

        if(!title || !description || !price)
            return res.status(400).json({msg: "Please fill all the details"});

        const course = await CourseModel.create({title, description, price, userId});

        // if course creation fails
        if(!course)
            return res.status(500).json({msg: "Internal server error"});

        res.status(201).json({msg: "Course successfully created", course});
    } catch(error) {
        console.error(error);
        res.status(500).json({msg: "Internal server error"});
    }
});
app.put('/admin/courses/:id', authorize('admin'), async function(req, res) {
    try {
        // this endpoint let's an admin update a course. 
        const courseId = req.params.id;
        const updates = req.body;

        // no need to check for course id, if it hadn't been there then the requiest wouldn't have hit this endpoint.

        if(!updates || Object.keys(updates).length == 0)
            return res.status(400).json({msg: "Nothing to update"});

        const updatedCourse = await CourseModel.findByIdAndUpdate(courseId, {$set: updates}, {new: true, runValidators: true});

        if(!updatedCourse)
            return res.status(500).json({msg: "Error during update"});

        res.status(200).json({msg: "Course updated", updatedCourse});

    }catch(error) {
        console.error(error);
        res.status(500).json({msg: "Internal server error"});
    }
});
app.get('/admin/courses', authorize('admin'), async function(req, res) {
    
    try {
        // this endpoint let's an admin to fetch all the courses they have created. 
        const userId = req.userId;
        const courses = await CourseModel.find({userId});// fetch all the course. 
        if(!courses || courses.length == 0)
            return res.json({msg: "No course created", userId});

        res.status(200).json(courses);// send to the frontend.
    }catch(error) {
        console.error(error);
        res.status(500).json({msg: "An error occured during fetching the courses"})
    }
});

app.listen(PORT, ()=> {
    console.log(`server is running on port: ${PORT}`);
});