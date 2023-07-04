const Product = require("../models/product");
const Datalist = require("../models/datalist");
const Codes = require("../models/codes");
const product = require("../models/product");

require("dotenv").config();

/**
 * Gets all the products from the database
 * @param {string} _id 
 * @returns {Promise<object>}
 */
const getProducts = _id => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = _id?await Product.findById(_id):await Product.find();                                            // If id is undefined, send every product
            if(!result?._id && !result?.length) return reject({ e: "No product found. " });                                 // If there is no product, reject

            resolve(result);                                                                                                // Send retrieved product(s)
        } catch (e) {
            reject({ e });
        }
    });
}

/**
 * Gets all the options of a given datalist from the database
 * @param {string} _id 
 * @returns {Promise<string[]>}
 */
const getDatalist = _id => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!_id) return reject({ e: "Invalid parameters. " });

            const dl = await Datalist.findById(_id);                                // retrieve datalsit
            if(!dl) {
                if(_id == "description" || _id == "location" || _id == "brand")     // If it doesn't exist, but should
                    await new Datalist({ _id, options: [] }).save();                // Creates it
                return reject({ e: "No datalist with this id. " });
            }
            
            resolve(dl.options);                                                    // Send all the options of the datalist
        } catch (e) {
            reject({ e });
        }
    });
}

/**
 * Gets all the code - description association saved in the database
 * @param {string} _id
 * @returns {Promise<object>}
 */
const getCodes = (_id = "0") => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!_id) return reject({ e: "Invalid parameters. " });

            const codes = await Codes.findById(_id);               
            if(!codes) {
                if(_id == "0")
                    await new Codes({ _id, codes: {}}).save();                      // If it doesn't exist but should, creates it
                return reject({ e: "No codes with this id. " });
            }

            resolve(codes.codes);
        } catch (e) {
            reject({ e });
        }
    });
}

/**
 * Adds a product to the database if the given parameters are valid
 * @param {object} product 
 * @returns {Promise<object>} product
 */
const addProduct = ({ description, brand, location, expiration_date, insertion_date, units }) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(units<=0) return reject({ e: "Invalid parameters. " });                                                      // check for invalid parameters ...

            resolve(await new Product({ description, brand, location, expiration_date, insertion_date, units }).save());    // Create, save and send new product
            // const p = await new Product({ description, brand, location, expiration_date, insertion_date, units }).save();
            // resolve(p);
        } catch (e) {
            reject({ e });
        }
    })
}

/**
 * Updates a product from the database, given its id and new parameters. The undefined parameters will be removed (only brand, the other ones are required).
 * @param {string} _id 
 * @param {object} product 
 * @returns {Promise<object>} new product
 */
const updateProduct = (_id, { description, brand, location, expiration_date, insertion_date, units }) => {
    return new Promise(async (resolve, reject) => {
        try {
            if( !description || !location  || !expiration_date || !insertion_date) return reject({ e: "Invalid parameters. " });

            // brand = brand ?? undefined;                                                                                  // Should be already undefiend... undefined values don't get saved
            if (units <= 0) await Product.findByIdAndDelete(_id);                                                           // If the new object has no units, deletes it
            else await Product.findOneAndReplace({ _id }, { description, brand, location, expiration_date, insertion_date, units });    // Update product with new one
            
            resolve({ _id, description, brand, location, expiration_date, insertion_date, units });                         // send new product
        } catch (e) {
            reject({ e })
        }
    });
}

/**
 * Adds an option to a given datalist from the database.
 * @param {string} _id 
 * @param {string} option 
 * @returns {Promise<object>} success
 */
const addOption = (_id, option) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!_id || !option) return reject({ e: "Invalid parameters. " });

            const dl = await Datalist.findById(_id);                                // Retrieve datalist
            if(!dl) return reject({ e: "No datalist with this id. " });             // Reject if it doesn't exist
            dl.options.push(option);                                                // Add new option to the datalist
            dl.save();                                                              // Save datalist

            resolve({ option });
        } catch (e) {
            reject({ e });
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
const addCode = (code, description, _id = "0") => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!code || !description) return reject({ e: "Invalid parameters. " });

            const codes = await Codes.findById(_id);                                // Retrieve codes data
            if(!codes) return reject({ e: "No codes with this id. " });

            codes.codes[code] = description;                                        // Sets new association

            codes.markModified('codes');                                            // I don't remember :weary:
            codes.save();                                                           // Saves to the database

            resolve({ code: description });
        } catch (e) {
            reject({ e });
        }
    });
}

module.exports.getProducts = getProducts;
module.exports.addProduct = addProduct;
module.exports.updateProduct = updateProduct;
module.exports.getDatalist = getDatalist;
module.exports.addOption = addOption;
module.exports.getCodes = getCodes;
module.exports.addCode = addCode;