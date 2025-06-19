const { UserModel } = require('../models/user');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const bcrypt = require('bcrypt');


async function signup(req, res) {
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

}


async function signin(req, res) {
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
}

module.exports = {
    signup, signin
}