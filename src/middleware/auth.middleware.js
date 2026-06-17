const jwt = require("jsonwebtoken");
const pool = require("../config/db");

async function requireAuth (req, res, next) {
    try {

        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication token is requried!"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const result = await pool.query(`SELECT id, name, email, created_at FROM users WHERE id = $1`, [decoded.userId]);

        if(result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "user no longer exists"
            });
        }

        req.user = result.rows[0];
        next();

    } catch (err) {
        console.error("Something went worng!");
        res.status(401).json({
            success: false,
            message: "Invalid or expired token!"
        })
    }
}

module.exports = {requireAuth};