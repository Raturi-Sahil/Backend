// const express = require('express');
// const Router = express.Router; Where express is an object of express and it has Router as a key.

const Router = require('express'); // here we are directly destructuring the Router key. 
const userRouter = Router();
const { authorize } = require('../middleware/auth');
const { courses, purchase, purchases } = require('../controllers/userController');



userRouter.use(authorize('user'));

userRouter.get('/courses', courses);
userRouter.post('/purchase/:id', purchase);
userRouter.get('/purchases', purchases);

module.exports = userRouter