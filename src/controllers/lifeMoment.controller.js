const pool = require("../config/db");

async function createLifeMoment (req, res) {
    try {
        const {title, content, occured_at, emotional_tone} = req.body;
        const userId = req.user.id;

        const result = await pool.query(
            `INSERT INTO life_moments 
            (user_id, title, content, occurred_at, emotional_tone)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING 
              id, user_id, title, content, occurred_at, emotional_tone, source, created_at, updated_at`,
            [
              userId,
              title || null,
              content,
              occured_at || null,
              emotional_tone || null,
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Life moment created successfully",
            data: {
                lifeMoment: result.rows[0],
            },
        });

    } catch(error) {
        console.error("Create life moment error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating life moment",
        });
    }
}

async function getLifeMoments(req, res) {
    try {
        const userId = req.user.id;
    
        const result = await pool.query(
            `SELECT 
            id, user_id, title, content, occurred_at, emotional_tone, source, created_at, updated_at
            FROM life_moments
            WHERE user_id = $1
            ORDER BY created_at DESC`,
            [userId]
        );
    
        return res.json({
            success: true,
            message: "Life moments fetched successfully",
            data: {
                lifeMoments: result.rows,
            },
        });
    } catch (error) {
        console.error("Get life moments error:", error);
    
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching life moments",
        });
    }
}

async function getLifeMomentById(req, res) {
    try {
        const userId = req.user.id;
        const { id } = req.params;
    
        const result = await pool.query(
            `SELECT 
            id, user_id, title, content, occurred_at, emotional_tone, source, created_at, updated_at
            FROM life_moments
            WHERE id = $1 AND user_id = $2`,
            [id, userId]
        );
    
        if (result.rows.length === 0) {
            return res.status(404).json({
            success: false,
            message: "Life moment not found",
            });
        }
    
        return res.json({
            success: true,
            message: "Life moment fetched successfully",
            data: {
            lifeMoment: result.rows[0],
            },
        });
    } catch (error) {
        console.error("Get life moment by id error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching life moment",
        });
    }
}

async function updateLifeMoment(req, res) {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { title, content, occurred_at, emotional_tone } = req.body;
    
        const result = await pool.query(
            `UPDATE life_moments
            SET
            title = COALESCE($1, title),
            content = COALESCE($2, content),
            occurred_at = COALESCE($3, occurred_at),
            emotional_tone = COALESCE($4, emotional_tone),
            updated_at = CURRENT_TIMESTAMP
            WHERE id = $5 AND user_id = $6
            RETURNING 
            id, user_id, title, content, occurred_at, emotional_tone, source, created_at, updated_at`,
            [
            title,
            content,
            occurred_at,
            emotional_tone,
            id,
            userId,
            ]
        );
    
        if (result.rows.length === 0) {
            return res.status(404).json({
            success: false,
            message: "Life moment not found",
            });
        }
    
        return res.json({
            success: true,
            message: "Life moment updated successfully",
            data: {
            lifeMoment: result.rows[0],
            },
        });
    } catch (error) {
        console.error("Update life moment error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating life moment",
        });
    }
}

async function deleteLifeMoment(req, res) {
    try {
        const userId = req.user.id;
        const { id } = req.params;
    
        const result = await pool.query(
            `DELETE FROM life_moments
            WHERE id = $1 AND user_id = $2
            RETURNING id`,
            [id, userId]
        );
    
        if (result.rows.length === 0) {
            return res.status(404).json({
            success: false,
            message: "Life moment not found",
            });
        }
    
        return res.json({
            success: true,
            message: "Life moment deleted successfully",
            data: {
            deletedLifeMomentId: result.rows[0].id,
            },
        });
    } catch (error) {
        console.error("Delete life moment error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting life moment",
        });
    }
}
  
module.exports = {createLifeMoment, getLifeMoments, getLifeMomentById, updateLifeMoment, deleteLifeMoment};