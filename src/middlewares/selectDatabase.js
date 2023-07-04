const dbNames = ["grasso-facile", "grasso-difficile"];

/** Middleware used to select the database to use (we have 2 different databases).
 *  If the provided name does not exist, a 400 bad request is thrown. */
const checkVersion = (req, res, next) => {
    const dbName = req.params.dbName;

    if(!dbNames.includes(dbName))
    return res.status(400).json({ e: "This database does not exist. "});

    req.dbName = dbName;
    return next();
};

module.exports = checkVersion;