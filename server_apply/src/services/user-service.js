const models = require("../models/data-models");
const { UserViewModel } = require("../models/view-models/user-view-model");

const Model = models.User;

const upsert = async (user) => {
  const item = await Model.findOne(user);
  if (item == null) {
    const model = await Model.createNew(user);
    const savedItem = await model.save();
    return savedItem._id;
  }
  return "Already exists";
};

const getAll = async () => {
  const items = await Model.find();
  let viewModels = items.map((item) => UserViewModel.convert(item));
  return viewModels;
};

const save = async (user) => {
  const model = await Model.createNew(user);
  model.updatedAt = Date.now().toString();
  model.createdAt = Date.now().toString();
  const savedItem = await model.save();
  return savedItem._id;
};

const update = async (user) => {
  const id = user._id;
  let model = await Model.findById(id);
  if (model) {
    model.firstName = user.firstName;
    model.lastName = user.lastName;
    model.email = user.email;
    model.phoneNumber = user.phoneNumber;
    model.updatedAt = Date.now().toString();
    model.save();
    return model._id;
  }

  throw new NotFound("User not found by the id: " + id);
};

const deleteById = async (id) => {
  let model = await Model.findById(id);
  if (model) {
    let result = await Model.deleteOne({ _id: id });
    return result;
  }

  throw new NotFound("User not found by the id: " + id);
};

const getById = async (id) => {
  let model = await Model.findById(id);
  let viewModel = UserViewModel.convert(model);
  return viewModel;
};

module.exports = { getAll, save, update, deleteById, getById, upsert };
