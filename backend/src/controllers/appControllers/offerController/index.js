const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const summary = require('./summary');

function modelController() {
  const methods = createCRUDController('Offer');
  methods.summary = summary;
  return methods;
}

module.exports = modelController();
