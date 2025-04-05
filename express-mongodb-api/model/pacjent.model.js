const mongoose = require("mongoose");
const { Schema } = mongoose;

const pacjentSchema = new Schema({
  id: { type: String, required: true },
  imie: { type: String, required: true },
  nazwisko: { type: String, required: true },
  wiek: { type: Number, required: true },
  sex: { type: String, required: true },
  kontoId: { type: String, required: true },
});

const PacjentModel = mongoose.model("Pacjent", pacjentSchema, "pacjenci");

module.exports = PacjentModel;
