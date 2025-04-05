const mongoose = require("mongoose");
const { Schema } = mongoose;
const rezerwacjaSchema = new Schema({
  data: { type: Date, required: true },
  start: { type: String, required: true },
  koniec: { type: String, required: true },
  lekarzId: { type: String, required: true },
  paid: { type: Boolean, required: true },
  id: { type: String, required: true },
  pacjentId: { type: String, required: true },
  informacje: { type: String, required: true },
  typ_konsultacji: { type: String, required: true },
  done: { type: Boolean, required: true },
  cancelled: { type: Boolean, required: true },
});

const RezerwacjaModel = mongoose.model(
  "Rezerwacja",
  rezerwacjaSchema,
  "rezerwacje"
);

module.exports = RezerwacjaModel;
