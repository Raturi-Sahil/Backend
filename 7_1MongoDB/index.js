const express = require('express');
const { UserModel, TodoModel } = require('./db');
const { auth, JWT_SECRET} = require('./auth');
const jwt = require('jsonwebtoken'); // This is what we call as importing the jsonwebtoken library, but before this we gotta intall the library using npm install jsonwebtoken


//Giving my backend our database credentials
const mongoose = require('mongoose');


// Generally this connection should also be awaited as it's an asynchronous function but here it works even without that, we'll surely do that in the future lectures.
mongoose.connect("mongodb+srv://suzakuk14:Q0VCLkpbLmldM3bI@cluster0.tlkpe9i.mongodb.net/todo-sahil");

const app = express();
app.use(express.json());


// endpoint for signup
app.post("/signup", async function(req, res) {
    try{

        const {email, password, name} = req.body;
        
        // if any of the fields is missing then we don't proceed..
        if(!email || !password || !name) {
            return res.status(400).json({
                msg: "All fields are required"
            });
        }

        // if the user already exists then we don't proceed and ask them to go to the sign-in page.
        const user = await UserModel.findOne({email});// just checking the email, since we have unique emails here.. 
        if(user)
        return res.status(409).json({msg: "Email already in use"});

        const response = await UserModel.create({email, password, name});

        if(response) {
            res.json({
                msg: "You are successfully signed up"
            });
        } else {
            return res.status(500).send({
                msg: "User Creation Failed, please try again later"
            });
        }
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            msg: "An unexpected error occured during sign up"
        });
    }
});

// endpoint for signin
app.post("/signin", async function(req, res) {
    try {//extract the email and password from the body
        const {email, password} = req.body;

        //Check if any field is unfilled.
        if(!email || !password) 
        return res.status(409).json({msg: "Please enter both the fields and try again"});

        //Check if the user exists or not. 
        const user = await UserModel.findOne({email});//Here only matching email, cuz email unique has been defined in the db and even generally email is unique.
        if(!user) {
            return res.status(401).json({msg: "Invalid credentials"}); // status 401 shows that you are not authorized.
        }else {
            //Create an authorization token for the user. 
            console.log(user._id);
            console.log(user._id.toString());
            const token = jwt.sign({id: user._id.toString()}, JWT_SECRET);

            if(!token)
            return res.status(500).json({msg: "An error occured during sign in, Please try again later"});

            res.status(201).json({
                authorization: token
            });
        }
    }catch(error) {
        console.error(error);
        res.status(500).json({msg: "An error occured during sign in, Please try again later"});
    }    

});

// this auth middleware will apply to all the endpoints below this point.
app.use(auth);


// endpoint to add todo to the database
app.post("/todo", auth, async function(req, res) {
    try {
        const userId = req.userId;
        const title = req.body.title;
        const done = req.body.done;

        if(!userId || !title || done === undefined)
        return res.status(400).json({msg: "Please fill in all the input fields"});

        const todo = await TodoModel.create({
            userId, title, done
        });

        if(todo) {
            res.status(201).json({
                msg: "Todo has been successfully added"
            });
        } else {
            return res.status(500).json({
                msg: "Todo couldn't be added, Try again later"
            });
        }
    }catch(error) {
        console.error(error);
        res.status(500).status({
            msg: "Error during todo creation, please try again later"
        });
    }
        
});

// endpoint to fetch all the todos of a user
app.get("/todos", auth, async function(req, res) {
    try{    
        const userId = req.userId;

        const todos = await TodoModel.find({userId});

        if(!todos) {
            return res.status(500).json({msg: "couldn't fetch the todos of the user, Please try again later"});
        } else {
            res.status(201).json({todos});
        }
    }catch(error){
        console.error(error);
        res.status(501).json({msg: "Error during todos fetch, Please try again later"});
    }
});



app.listen(3000, function() {
    console.log("listening at port 3000.....");
});