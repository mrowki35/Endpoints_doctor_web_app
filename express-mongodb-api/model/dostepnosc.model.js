const mongoose = require("mongoose");
const { Schema } = mongoose;

const dostepnoscSchema = new Schema({
  lekarzId: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  monday: { type: Boolean, required: true },
  tuesday: { type: Boolean, required: true },
  wednesday: { type: Boolean, required: true },
  thursday: { type: Boolean, required: true },
  friday: { type: Boolean, required: true },
  saturday: { type: Boolean, required: true },
  sunday: { type: Boolean, required: true },
});

const DostepnoscModel = mongoose.model(
  "Dostepnosc",
  dostepnoscSchema,
  "dostepnosci"
);

module.exports = DostepnoscModel;
