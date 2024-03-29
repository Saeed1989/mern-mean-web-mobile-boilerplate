const express = require("express");
const { save, update, deleteById } = require("../services/data-service");
const validators = require("../models/request-models");
const {
  handleValidation,
  logRequest,
  checkAuthentication,
  checkPermission,
} = require("../middlewares");
const { NotFound } = require("../utils/errors");

const router = express.Router();

const postHandler = async (req, res, next) => {
  try {
    const body = req.body;
    const id = await save(body);
    res.status(201).send(id);
  } catch (error) {
    return next(error, req, res);
  }
};

const putHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const body = { ...req.body, id: id };
    await update(body);
    res.status(200).send(id);
  } catch (error) {
    return next(error, req, res);
  }
};

const deleteHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    await deleteById(id);
    res.status(200).send("Data deleted");
  } catch (error) {
    return next(error, req, res);
  }
};

const addReourceName = async (req, res, next) => {
  req.resourceName = "data-edit";
  next();
};

const commonMiddleware = [
  addReourceName,
  logRequest,
  checkAuthentication,
  checkPermission,
];

router.post(
  "/",
  commonMiddleware,
  handleValidation(validators.dataSchemaValidate),
  postHandler
);
router.put(
  "/:id",
  commonMiddleware,
  handleValidation(validators.dataSchemaValidate),
  putHandler
);
router.delete("/:id", commonMiddleware, deleteHandler);

module.exports = router;
