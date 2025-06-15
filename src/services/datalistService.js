const DatalistSchema = require("../models/datalist");
const { getModelFromDbName } = require("./databaseService");


/* ---------------------------------------------------------------------------------------------------------------- */
const getDatalistInternal = async (DatalistModel, _id) => {
    const datalist = await DatalistModel.findById(_id);                     // Retrieve datalist
    if (datalist) return datalist.options;                                  // If exists, send all the options

    if (_id == "description" || _id == "location" || _id == "brand")        // If doesn't exist, but should
        await new DatalistModel({ _id, options: [] }).save();               // Creates it
    throw "No datalist with this id. ";
}

const addOptionInternal = async (DatalistModel, _id, option) => {
    const datalist = await DatalistModel.findById(_id);                     // Retrieve datalist
    if (!datalist) throw "No datalist with this id. ";                      // Reject if it doesn't exist
    if (datalist.options.includes(option)) throw "Option already present.";

    datalist.options.push(option);                                          // Add new option to the datalist
    datalist.save();                                                        // Save datalist

    return option;
}
/* ---------------------------------------------------------------------------------------------------------------- */


/**
 * Gets all the options of a given datalist from the database
 * @param {string} _id 
 * @returns {Promise<string[]>}
 */
const getDatalist = (_id, dbName = "grasso-facile") => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!_id) return reject("Invalid or missing id. ");

            resolve(await getModelFromDbName(dbName, "Datalist", DatalistSchema, getDatalistInternal, _id));
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * Adds an option to a given datalist from the database.
 * @param {string} _id 
 * @param {string} option 
 * @returns {Promise<object>} success
 */
const addOption = (_id, option, dbName = "grasso-facile") => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!_id || !option) return reject("Invalid or missing id or option. ");

            resolve(await getModelFromDbName(dbName, "Datalist", DatalistSchema, addOptionInternal, _id, option));
        } catch (e) {
            reject(e);
        }
    });
}

module.exports.getDatalist = getDatalist;
module.exports.addOption = addOption;