const mongoose = require("../config/database");

const useDbOptions = {
    useCache: true,
    noListener: true
}

/**
 * Returns the given model of the given database, using the same connection
 * @param {string} dbName grasso-facile | grasso-difficile 
 * @param {*} modelName "Codes" | "Datalist" | "Product"
 * @param {*} modelSchema 
 * @returns 
 */
// const getModelFromDbName = (dbName, modelName, modelSchema) => mongoose.connection.useDb(dbName, useDbOptions).model(modelName, modelSchema)
const getModelFromDbName = (dbName, modelName, modelSchema, fn, ...params) => {

    // Get the new database connection based on the name in input
    const newConnection = mongoose.connection.useDb(dbName, useDbOptions);

    // Get the new schema associated with the new database
    const newModel = newConnection.model(modelName, modelSchema);

    // If there is no callBack, returns newConnection and Model syncronously
    if (!fn) return { newConnection, newModel };

    // Use the provided callback function
    return new Promise(async (resolve, reject) => {
        try {
            resolve(await fn(newModel, ...params));
        } catch (e) {
            reject(e);
        }

        // Remove the models (??)
        newConnection.deleteModel(/.*/);
    })
}

module.exports.getModelFromDbName = getModelFromDbName;