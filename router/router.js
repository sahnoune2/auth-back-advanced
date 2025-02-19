const express = require("express");

const {
  signUp,
  signIn,
  getCurrent,
  emailValidation,
  updateUser,
} = require("../control/control");
const isAuth = require("../middleWare/isAuth");
const {
  signUpValidation,
  validation,
  signInValidation,
} = require("../middleWare/validation");
const {
  addProduct,
  getProduct,
  getOneProduct,
  deleteOneProduct,
  addPanier,
  addOrder,
  removeFromPanier,
  clearPanier,
} = require("../control/productControl");
const isAuthAdmin = require("../middleWare/isAuthAdmin");

const userRouter = express.Router();
const productRouter = express.Router();

userRouter.post("/addUser", signUp);
userRouter.post("/signIn", signInValidation, validation, signIn);
userRouter.post("/auth", isAuth, getCurrent);
userRouter.post("/email", signUpValidation, validation, emailValidation);
userRouter.put("/updateUser",isAuth, updateUser);

productRouter.post("/add", isAuthAdmin, addProduct);
productRouter.get("/list", getProduct);
productRouter.get("/One/:id", getOneProduct);
productRouter.delete("/del/:id", isAuthAdmin, deleteOneProduct);
productRouter.post("/addPanier",isAuth, addPanier);
productRouter.post("/addOrder",isAuth, addOrder);
productRouter.delete("/deleteOne",isAuth, removeFromPanier);
productRouter.delete("/deleteAll",isAuth, clearPanier);

module.exports = { userRouter, productRouter };
