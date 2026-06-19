const pool = require('../config/db');

async function getEmotions (req, res) {
    try {
        const result = await pool.query(`SELECT id, name, description, created_at FROM emotions ORDER BY name ASC`);

        return res.json({
            success: true,
            message: "Emotions fetched successfully!",
            date: {
                emotions: result.rows
            }
        });
    }catch (error) {
        console.error("Get emotions error:", error);
        return res.status(500).json({
        success: false,
        message: "Something went wrong while fetching emotions",
        });
    }
}

async function getThemes(req, res) {
    try {
        const result = await pool.query(
            `SELECT id, name, description, created_at
            FROM themes
            ORDER BY name ASC`
        );
    
        return res.json({
            success: true,
            message: "Themes fetched successfully",
            data: {
            themes: result.rows,
            },
        });
    } catch (error) {
        console.error("Get themes error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching themes",
        });
    }
}

async function getValues(req, res) {
    try {
        const result = await pool.query(
            `SELECT id, name, description, created_at
            FROM values
            ORDER BY name ASC`
        );
    
        return res.json({
            success: true,
            message: "Values fetched successfully",
            data: {
            values: result.rows,
            },
        });
    } catch (error) {
        console.error("Get values error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching values",
        });
    }
}

module.exports = { getEmotions, getThemes, getValues };