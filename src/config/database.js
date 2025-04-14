const mongoose = require("mongoose");	// MongoDB Database connector
require("dotenv").config();				// Enviroment variables setup

const address = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/`;
console.log(`Trying to connect to ${address}...`);

mongoose.connect(address,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    },
    () => console.log("MongoDB successfully connected.")
);

module.exports = mongoose;