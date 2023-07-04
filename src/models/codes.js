const mongoose = require("../config/database");

module.exports = new mongoose.Schema(
    {
        _id: String,
        codes: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
    },
    {
        timestamps: false,
        minimaze: false
    }
);