const mongoose = require("mongoose");	// MongoDB Database connector
require("dotenv").config();				// Enviroment variables setup

mongoose.connect(process.env.MONGO_URL,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    },
    () => console.log("MongoDB successfully connected.")
);

module.exports = mongoose;