const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema({
  reservationId: { type: String, required: true },
  lekarzId: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, required: true },
  rate: { type: Number, required: true },
  userId: { type: String, required: true },
});

const CommentModel = mongoose.model("Comment", commentSchema, "comments");

module.exports = CommentModel;
