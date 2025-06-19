const authRouter = require('express');
const { signup, signin } = require('../controllers/authController');


authRouter.post('/signup', signup);
authRouter.post('/signin', signin);


module.exports = authRouter;