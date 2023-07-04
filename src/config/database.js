const mongoose = require("mongoose");	// MongoDB Database connector
require("dotenv").config();				// Enviroment variables setup

const mongoDbAddress = process.env.TEST ? process.env.MONGO_URL_TEST : process.env.MONGO_URL
console.log(`Trying to connect to ${mongoDbAddress}...`);

mongoose.connect(mongoDbAddress,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    },
    () => console.log("MongoDB successfully connected.")
);

module.exports = mongoose;