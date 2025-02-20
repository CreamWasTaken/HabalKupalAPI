const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
});

// Create the User model using the schema
const Users = mongoose.model("Users", usersSchema);

module.exports = Users;  // Export the model directly
