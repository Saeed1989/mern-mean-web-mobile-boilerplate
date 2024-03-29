const models = require("../models/data-models");
const {
  ResourceViewModel,
} = require("../models/view-models/resource-view-model");
const { NotFound } = require("../utils/errors");
const Model = models.Resource;

const upsert = async (resource) => {
  const item = await Model.findOne(resource);
  if (item == null) {
    const model = await Model.createNew(resource);
    const savedItem = await model.save();
    return savedItem._id;
  }
  return "Already exists";
};

const getAll = async () => {
  const items = await Model.find();
  let viewModels = items.map((item) => ResourceViewModel.convert(item));
  return viewModels;
};

const save = async (resource) => {
  const model = await Model.createNew(resource);
  model.updatedAt = Date.now().toString();
  model.createdAt = Date.now().toString();
  const savedItem = await model.save();
  return savedItem._id;
};

const update = async (resource) => {
  const id = resource.id;
  let model = await Model.findById(id);
  if (model) {
    model.name = resource.name;
    model.type = resource.type;
    model.updatedAt = Date.now().toString();
    await model.save();
    return model._id;
  }
  throw new NotFound("Resource not found by the id: " + id);
};

const deleteById = async (id) => {
  let model = await Model.findById(id);
  if (model) {
    let result = await Model.deleteOne({ _id: id });
    return result;
  }

  throw new NotFound("Resource not found by the id: " + id);
};

const getById = async (id) => {
  let model = await Model.findById(id);
  let viewModel = ResourceViewModel.convert(model);
  return viewModel;
};

module.exports = { getAll, save, update, deleteById, getById, upsert };
