const router = require("express").Router();
const productService = require("../services/productService");
const datalistService = require("../services/datalistService");
const codesService = require("../services/codesService");

/* ==== PRODUCTS ROUTER ========================================================================= */
/** Retrieves a single product using the provided id and returns it to the caller. */
router.get("/products/:_id?", async (req, res) => {
    try {
        // res.json(await productService.getProducts(req.params._id, req.dbName)); 
        const data = JSON.stringify(await productService.getProducts(req.params._id, req.dbName));  // Convert data to string that can be chunked and sent
        res.write(data);
        res.end();
    } catch (e) {
        // TODO: catch different errors
        console.log(e);
        res.status(400).json({ e });
    }
});

/** Saves the product with the provided data. */
router.post("/products/add", async (req, res) => {
    try {
        res.json(await productService.addProduct(req.body.product, req.dbName));
    } catch (e) {
        // TODO: catch different errors
        console.log(e);
        res.status(400).json({ e });
    }
});

/** Saves changes to an already existing product. */
router.post("/products/update/:_id", async (req, res) => {
    try {
        res.json(await productService.updateProduct(req.params._id, req.body, req.dbName));
    } catch (e) {
        // TODO: catch different errors
        console.log(e);
        res.status(400).json({ e });
    }
});


/* ==== DATALISTS ROUTER ======================================================================== */
/** Retrieves a datalist using the provided id and returns it to the caller.
 *  Datalists are lists containing all the available values for a set of product properties.
 *  The handled properties are: "brand", "location", "description". */
router.get("/datalists/:_id", async (req, res) => {
    try {
        // res.json(await datalistService.getDatalist(req.params._id, req.dbName));
        const data = JSON.stringify(await datalistService.getDatalist(req.params._id, req.dbName));
        res.write(data);
        res.end();
    } catch (e) {
        // TODO: catch different errors
        console.log(e);
        res.status(400).json({ e });
    }
});

/** Adds an option to an existing datalist. New datalists must be added manually. */
router.post("/datalists/:_id", async (req, res) => {
    try {
        res.json(await datalistService.addOption(req.params._id, req.body.option, req.dbName));
    } catch (e) {
        // TODO: catch different errors
        console.log(e);
        res.status(400).json({ e });
    }
});


/* ==== CODES ROUTER ============================================================================ *
router.get("/codes", async (req, res) => {
    try {
        // res.json(await codesService.getCodes(, req.dbName));

        const data = JSON.stringify(await codesService.getCodes(req.dbName));
        res.write(data);
        res.end();
    } catch (e) {
        //TODO: catch different errors
        console.log(e);
        res.status(400).json({ e });
    }
});

router.post("/codes/add", async (req, res) => {
    try {
        res.json(await codesService.addCode(req.body.code, req.body.description, req.dbName));
    } catch (e) {
        //TODO: catch different errors
        console.log(e);
        res.status(400).json({ e });
    }
});
/* ==== */

module.exports = router;