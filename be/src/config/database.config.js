const { Pool } = require('pg');
require('dotenv').config();

let pool;
if (process.env.SUPABASE_DB_URL) {
    // If SUPABASE_DB_URL is provided, use it directly. This works for Supabase Postgres URLs.
    pool = new Pool({
        connectionString: process.env.SUPABASE_DB_URL,
        ssl: { rejectUnauthorized: false },
    });
} else {
    pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });
}



const query = async (text, params) => {
    try {
        const res = await pool.query(text, params);
        return res;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};

module.exports = {
    pool,
    query
};