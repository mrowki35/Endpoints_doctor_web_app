const mongoose = require("mongoose");
const { Schema } = mongoose;

const absencjaSchema = new Schema({
  lekarzId: { type: String, required: true },
  data: { type: Date, required: true },
});

const AbsencjaModel = mongoose.model("Absencja", absencjaSchema, "absencje");

module.exports = AbsencjaModel;
