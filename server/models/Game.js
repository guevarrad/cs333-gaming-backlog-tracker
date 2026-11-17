
const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    enum: ["Not Started", "Playing", "Completed"],
    default: "Not Started"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Game", gameSchema);
