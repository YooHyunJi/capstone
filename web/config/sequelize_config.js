require('dotenv').config();
 
const development = {
    username: "root",
    password: process.env.DB_SECRET,
    database: "capstone",
    host: "127.0.0.1",
    dialect: "mysql"
};

const test = {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql"
};

const production = {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql"
};

module.exports = { development, test, production };