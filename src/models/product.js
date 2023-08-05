const mongoose = require("../config/database");

module.exports = new mongoose.Schema(
    {
        description: { type: String, required: true, min: 2 },
        brand: { type: String, required: false, min: 2 },
        location: { type: String, required: true, min: 2 },
        insertion_date: { type: String, required: true },
        expiration_date: { type: String, required: true },
        units: { type: Number, default: 1 },


        optional: { type: String, required: false },

        // [2023-07-03] Aggiunta gestione di peso, calorie*100g e calcolo calorie
        cal: { type: Number, required: false },
        wgt: { type: Number, required: false },

        // [2023-08-04] Aggiunta gestione di prodotti "selezionati"
        check: { type: Boolean, required: false }
    },
    {
        timestamps: false
    }
);