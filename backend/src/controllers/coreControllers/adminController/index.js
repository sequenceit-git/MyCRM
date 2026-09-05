const createUserController = require('@/controllers/middlewaresControllers/createUserController');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const userController = createUserController('Admin');
const crudController = createCRUDController('Admin');

module.exports = {
  ...crudController,
  ...userController,
};
