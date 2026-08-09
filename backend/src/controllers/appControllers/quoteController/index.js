const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const summary = require('./summary');

function modelController() {
  const methods = createCRUDController('Quote');
  methods.summary = summary;
  return methods;
}

module.exports = modelController();
