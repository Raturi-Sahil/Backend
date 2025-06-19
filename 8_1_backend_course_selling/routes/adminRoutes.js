const Router = require('express');
const adminRouter = Router();
const { authorize } = require('../middleware/auth');
const { erase, create, update, fetch } = require('../controllers/adminController');


    adminRouter.delete('/courses/:id', authorize('admin'), erase);

    adminRouter.post('/courses', authorize('admin'), create);

    adminRouter.put('/courses/:id', authorize('admin'),update);

    adminRouter.get('/courses', authorize('admin'),fetch);

module.exports = adminRouter;