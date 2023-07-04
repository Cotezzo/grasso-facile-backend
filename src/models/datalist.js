const mongoose = require("../config/database");

module.exports = new mongoose.Schema(
    {
        _id: String,
        options: [String]
    },
    {
        timestamps: false
    }
);