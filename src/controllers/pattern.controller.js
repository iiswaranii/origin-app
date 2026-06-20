const pool = require('../config/db');

async function getEmotionPatterns (req, res) {
    try {
        const userId = req.user.id;
        const result = await query(`SELECT e.id, e.name, e.description, COUNT(*) AS count 
            FROM reflection_emotions re 
            JOIN reflections r ON r.id = re.reflection_id
            JOIN emotions e ON e.id = re.emotion_id
            WHERE r.user_id=$1
            GROUP BY e.id, e.name, e.description
            ORDER BY BY count DESC, e.name ASC`, [userId]);

        return res.status(200).json({
            success: true,
            message: "Emotion patterns fetched successfully",
            data: {
                emotions: result.rows,
            }
        })

    } catch (error) {
        console.error("");
        res.status(500).json({
            success: false,
            message: "Something went wrong while fetching emotion patterns!"
        })
    }
}

async function getThemePatterns(req, res) {
    try {
        const userId = req.user.id;
        const result = await pool.query(
            `SELECT
            t.id,
            t.name,
            t.description,
            COUNT(*)::int AS count
            FROM reflection_themes rt
            JOIN reflections r ON r.id = rt.reflection_id
            JOIN themes t ON t.id = rt.theme_id
            WHERE r.user_id = $1
            GROUP BY t.id, t.name, t.description
            ORDER BY count DESC, t.name ASC`,
            [userId]
        );
    
        return res.json({
            success: true,
            message: "Theme patterns fetched successfully",
            data: {
            themes: result.rows,
            },
        });
    } catch (error) {
        console.error("Get theme patterns error:", error);
    
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching theme patterns",
        });
    }
}

async function getValuePatterns(req, res) {
    try {
        const userId = req.user.id;
        const result = await pool.query(
            `SELECT
            v.id,
            v.name,
            v.description,
            COUNT(*)::int AS count
            FROM reflection_values rv
            JOIN reflections r ON r.id = rv.reflection_id
            JOIN values v ON v.id = rv.value_id
            WHERE r.user_id = $1
            GROUP BY v.id, v.name, v.description
            ORDER BY count DESC, v.name ASC`,
            [userId]
        );
    
        return res.json({
            success: true,
            message: "Value patterns fetched successfully",
            data: {
            values: result.rows,
            },
        });
    } catch (error) {
        console.error("Get value patterns error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching value patterns",
        });
    }
}
  
module.exports = {
    getEmotionPatterns,
    getThemePatterns,
    getValuePatterns
};