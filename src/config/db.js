const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.on("coonect", () => {
    console.log("Database Connected✅")
});

module.exports = pool;