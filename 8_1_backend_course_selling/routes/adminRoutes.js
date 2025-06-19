const Router = require('express');
const adminRouter = Router();
const { erase, create, update, fetch } = require('../controllers/adminController');


    adminRouter.delete('/courses/:id', erase);

    adminRouter.post('/courses', create);

    adminRouter.put('/courses/:id',update);

    adminRouter.get('/courses',fetch);

module.exports = adminRouter;