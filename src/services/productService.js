const ProductSchema = require("../models/product");
const { getModelFromDbName } = require("./databaseService");


/* ==== UTILS =================================================================================== */
const getProductsInternal = async (ProductModel, _id) => {
    const result = _id ? await ProductModel.findById(_id) : await ProductModel.find();
    if (!result?._id && !result?.length) throw "No product found. ";
    return result;
}

const addProductInternal = async (ProductModel, product) => await new ProductModel(product).save()

const updateProductInternal = async (ProductModel, _id, product) => {
    if (product.units <= 0) await ProductModel.findByIdAndDelete(_id);  // If the new object has no units, deletes it
    else await ProductModel.findOneAndReplace({ _id }, product);        // Update product with new one
    return { _id, ...product };                                         // send new product
}

const validateNewProduct = (product) => {
    if(product.units <= 0)          return reject("Units must be greater than 0");
    return validateProduct(product);
}

const validateProduct = ({ description, brand, location, expiration_date, insertion_date, units, cal, wgt, optional }) => {
    if (!description)       return reject("Missing description");
    if(!location)           return reject("Missing location");
    if(!expiration_date)    return reject("Missing expiration_date");
    if(!insertion_date)     return reject("Missing insertion_date");
    return { description, brand, location, expiration_date, insertion_date, units, cal, wgt, optional };
}

/* ==== CORE ==================================================================================== */
/**
 * Gets all the products from the database
 * @param {string} _id 
 * @returns {Promise<object>}
 */
const getProducts = (_id, dbName = "grasso-facile") => {
    return new Promise(async (resolve, reject) => {
        try {
            resolve(await getModelFromDbName(dbName, "Product", ProductSchema, getProductsInternal, _id));
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * Adds a product to the database if the given parameters are valid
 * @param {object} product 
 * @returns {Promise<object>} product { description, brand, location, expiration_date, insertion_date, units, optional }
 */
const addProduct = (product, dbName = "grasso-facile") => {
    return new Promise(async (resolve, reject) => {
        try {
            // Check mandatory properties and remove unwanted ones (if any)
            product = validateNewProduct(product);

            // Call the (dbName), and callback the method with the correct Schema and parameters
            resolve(await getModelFromDbName(dbName, "Product", ProductSchema, addProductInternal, product));
        } catch (e) {
            reject(e);
        }
    })
}

/**
 * Updates a product from the database, given its id and new parameters. The undefined parameters will be removed (only brand, the other ones are required).
 * @param {string} _id 
 * @param {object} product 
 * @returns {Promise<object>} new product
 */
const updateProduct = (_id, product, dbName = "grasso-facile") => {
    return new Promise(async (resolve, reject) => {
        try {
            // Check mandatory properties and remove unwanted ones (if any)
            product = validateProduct(product);

            // brand = brand ?? undefined; - Should be already undefined... undefined values don't get saved
            // Call the (dbName), and callback the method with the correct Schema and parameterss
            resolve(await getModelFromDbName(dbName, "Product", ProductSchema, updateProductInternal, _id, product));
        } catch (e) {
            reject(e);
        }
    });
}

/* ==== EXPORTS ================================================================================= */
module.exports.getProducts = getProducts;
module.exports.addProduct = addProduct;
module.exports.updateProduct = updateProduct;