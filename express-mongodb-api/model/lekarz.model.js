const mongoose = require("mongoose");
const { Schema } = mongoose;

const lekarzSchema = new Schema({
  id: { type: String, required: true },
  imie: { type: String, required: true },
  nazwisko: { type: String, required: true },
  specjalizacja: { type: String, required: true },
});

const LekarzModel = mongoose.model("Lekarz", lekarzSchema, "doctors");

module.exports = LekarzModel;
