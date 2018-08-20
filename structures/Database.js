const Sequelize = require("sequelize");

const DB = new Sequelize({
    host: "localhost",
    dialect: "sqlite",
    logging: false,
    operatorsAliases: false,
    define: {
        collate: "utf8mb4_bin"
    },
    storage: "./Database.sqlite",
});

let str = Sequelize.STRING(300);

const Maps = DB.define("bumps", { latest: str });

class Database {
    constructor() {
        DB.sync();
        return DB;
    }
    static reset() {
        return DB.sync({ force: true });
    }
    static get Maps() { return Maps }
};

module.exports = Database;