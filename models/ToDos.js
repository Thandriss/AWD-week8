const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let todos = new Schema({
    user: String,
    items: []
});

module.exports = mongoose.model("Todo", todos);