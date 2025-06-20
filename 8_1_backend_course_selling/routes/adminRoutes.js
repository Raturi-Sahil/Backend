const Router = require('express');
const adminRouter = Router();
const { authorize } = require('../middleware/auth');
const { erase, create, update, fetch } = require('../controllers/adminController');

adminRouter.use(authorize('admin'));

adminRouter.delete('/courses/:id', erase);

adminRouter.post('/courses', create);

adminRouter.put('/courses/:id',update);

adminRouter.get('/courses',fetch);

module.exports = adminRouter;