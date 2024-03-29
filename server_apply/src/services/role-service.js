const models = require("../models/data-models");
const { RoleViewModel } = require("../models/view-models/role-view-model");
const { NotFound } = require("../utils/errors");
const Model = models.Role;

const getAll = async () => {
  const items = await Model.find();
  let viewModels = items.map((item) => RoleViewModel.convert(item));
  return viewModels;
};

const upsert = async (role) => {
  const item = await Model.findOne(role);
  if (item == null) {
    const model = await Model.createNew(role);
    const savedItem = await model.save();
    return savedItem._id;
  }
  return "Already exists";
};

const save = async (role) => {
  const model = await Model.createNew(role);
  model.updatedAt = Date.now().toString();
  model.createdAt = Date.now().toString();
  const savedItem = await model.save();
  return savedItem._id;
};

const update = async (role) => {
  const id = role.id;
  let model = await Model.findById(id);
  if (model) {
    model.name = role.name;
    model.alias = role.alias;
    model.updatedAt = Date.now().toString();
    model.save();
    return model._id;
  }
  throw new NotFound("Role not found by the id: " + id);
};

const deleteById = async (id) => {
  let model = await Model.findById(id);
  if (model) {
    let result = await Model.deleteOne({ _id: id });
    return result;
  }

  throw new NotFound("Role not found by the id: " + id);
};
const getById = async (id) => {
  let model = await Model.findById(id);
  let viewModel = RoleViewModel.convert(model);
  return viewModel;
};

const search = async (payload) => {
  let dateQuery = {};
  if (payload.fromDate && payload.toDate) {
    dateQuery = { updatedAt: { $gte: payload.fromDate, $lte: payload.toDate } };
  }

  let searchQuery = {};
  if (payload.searchText) {
    searchQuery = { name: { $regex: payload.searchText, $options: "i" } };
  }

  let query = { $and: [dateQuery, searchQuery] };

  const items = await Model.find(query);
  let viewModels = items.map((item) => RoleViewModel.convert(item));
  return viewModels;
};

module.exports = { getAll, save, update, deleteById, getById, search, upsert };
