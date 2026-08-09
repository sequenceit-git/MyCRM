const { modelsFiles } = require('@/models/utils');

const mongoose = require('mongoose');

const create = require('./create');
const read = require('./read');
const update = require('./update');
const remove = require('./remove');
const search = require('./search');
const filter = require('./filter');
const summary = require('./summary');
const listAll = require('./listAll');
const paginatedList = require('./paginatedList');

const createCRUDController = (modelName) => {
  if (!modelsFiles.includes(modelName)) {
    throw new Error(`Model ${modelName} does not exist`);
  }

  const Model = mongoose.model(modelName);
  const isGuest = (req) =>
    req.headers['x-guest-mode'] === 'true' ||
    req.admin?.role === 'guest' ||
    req.admin?.email?.startsWith('guest');
  const guestBlock = (res) =>
    res.status(403).json({
      success: false,
      result: null,
      message: 'View-Only Demo Mode: Modifications are disabled in guest preview.',
    });

  let crudMethods = {
    create: (req, res) => (isGuest(req) ? guestBlock(res) : create(Model, req, res)),
    read: (req, res) => read(Model, req, res),
    update: (req, res) => (isGuest(req) ? guestBlock(res) : update(Model, req, res)),
    delete: (req, res) => (isGuest(req) ? guestBlock(res) : remove(Model, req, res)),
    list: (req, res) => paginatedList(Model, req, res),
    listAll: (req, res) => listAll(Model, req, res),
    search: (req, res) => search(Model, req, res),
    filter: (req, res) => filter(Model, req, res),
    summary: (req, res) => summary(Model, req, res),
  };
  return crudMethods;
};

module.exports = createCRUDController;
