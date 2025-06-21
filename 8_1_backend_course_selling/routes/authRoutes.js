const Router = require('express');
const authRouter = Router();
const { signup, signin } = require('../controllers/authController');
const validate = require('../middleware/validator');
const { signupSchema, signinSchema } = require('../schemas/authSchema')


authRouter.post('/signup', validate(signupSchema), signup);
authRouter.post('/signin', validate(signinSchema) , signin);

module.exports = authRouter;