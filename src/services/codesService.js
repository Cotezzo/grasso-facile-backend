const CodesSchema = require("../models/codes");
const { getModelFromDbName } = require("./databaseService");


/* ---------------------------------------------------------------------------------------------------------------- */
const getCodesInternal = async (CodesModel, _id) => {
    const codes = await CodesModel.findById(_id);                   // Retrieve codes
    if (codes) return codes.codes;                                  // If exists, send all the associations
    if (_id == "0")                                                 // If it doesn't, but should
        await new CodesModel({ _id, codes: {} }).save();            // Creates it
    throw "No codes with this id. ";
}

const addCodeInternal = async (CodesModel, code, description, _id) => {
    const codes = await CodesModel.findById(_id);                   // Retrieve codes data
    if (!codes) throw "No codes with this id. ";                    // If it doesn't exist, throw

    codes.codes[code] = description;                                // Set/Override association
    codes.markModified('codes');                                    // I don't remember :weary:
    codes.save();                                                   // Saves to the database

    return { code: description };
}
/* ---------------------------------------------------------------------------------------------------------------- */


/**
 * Gets all the code - description association saved in the database
 * @param {string} _id
 * @returns {Promise<object>}
 */
const getCodes = (dbName = "grasso-facile") => {
    return new Promise(async (resolve, reject) => {
        try {
            resolve(await getModelFromDbName(dbName, "Codes", CodesSchema, getCodesInternal, "0"));
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * Adds a code - description association to a given codes from the database.
 * @param {string} code 
 * @param {string} description 
 * @param {string} _id codes id
 * @returns {Promise<object>} success
 */
const addCode = (code, description, dbName = "grasso-facile") => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!code || !description) return reject("Invalid or missing code or description. ");

            resolve(await getModelFromDbName(dbName, "Codes", CodesSchema, addCodeInternal, code, description, "0"));
        } catch (e) {
            reject(e);
        }
    });
}


module.exports.getCodes = getCodes;
module.exports.addCode = addCode;