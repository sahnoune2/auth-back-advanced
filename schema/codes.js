const mongoose = require("mongoose");

const codeSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
});

const codesCollection = mongoose.model("codes", codeSchema);

module.exports = codesCollection;
