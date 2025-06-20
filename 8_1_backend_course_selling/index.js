const express = require('express');
require('dotenv').config();// Importing the dotenv library.
const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL;

const mongoose = require('mongoose');

const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRoutes');
const authRouter = require('./routes/authRoutes');

// const z = require('zod');

// what does this line even do ?, well it means create an instance of express http server. 
const app = express();

// Middleware to parse json
app.use(express.json());

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);
    
/* Establishing connection to the database, since it's an async function and will return promise therfore we are using .then and .catch structure and also making sure that the server doesn't run without
    successfull connection to database. 
*/
mongoose.connect(DB_URL) 
.then(() => { // we can easily refactor it and write it in async await style too. Just a matter of taste. 
    console.log("connected to DB");

    app.listen(PORT, ()=> {
    console.log(`server is running on port: ${PORT}`);
  });
})
.catch(err => {
    console.error("DB connection error: ",err);
    process.exit(1);
});
