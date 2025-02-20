const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  homes: [
    {
      home_id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() }, // Unique ID for each home
      longitude: { type: Number, required: true },
      latitude: { type: Number, required: true }
    }
  ]
});

// Create the User model using the schema
const Users = mongoose.model("Users", usersSchema);

module.exports = Users; // Export the model directly
