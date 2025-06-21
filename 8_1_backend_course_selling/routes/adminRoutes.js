const Router = require('express');
const adminRouter = Router();
const { authorize } = require('../middleware/auth');
const { erase, create, update, fetch } = require('../controllers/adminController');
const validate = require('../middleware/validator');
const { courseCreateSchema, courseUpdateSchema } = require('../schemas/ courseSchema');




adminRouter.use(authorize('admin'));

adminRouter.delete('/courses/:id', erase);

adminRouter.post('/courses', validate(courseCreateSchema), create);

adminRouter.put('/courses/:id', validate(courseUpdateSchema), update);

adminRouter.get('/courses',fetch);

module.exports = adminRouter;