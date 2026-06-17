const pool = require("../config/db");

async function createReflection(req, res) {
    try {

        const {content, mood} = req.body;
        const userId = req.user.id;

        const result = await pool.query(`INSERT INTO reflections (user_id, content, mood) VALUES ($1, $2, $3) RETURNING id, user_id, content, mood, source, created_at, updated_at`, [userId, content, mood || null]);

        return res.status(200).json({
            success: true,
            message: "Reflection created successfully",
            data: {reflection: result.rows[0]}
        });

    } catch (error) {
        console.error("Create reflection error:", error);
        return res.status(500).json({
        success: false,
        message: "Something went wrong while creating reflection",
        });
    }
}

async function getReflections(req, res) {
    try {
        const userId = req.user.id;

        const result = await pool.query(`SELECT id, user_id, content, mood, source, created_at, updated_at FROM reflections WHERE user_id = $1 ORDER BY created_at DESC`, [userId]);

        return res.json({
            success: true,
            message: "Reflections fetched successfully",
            data: {
                reflections: result.rows,
            }
        })

    }catch(error) {
        console.error("Get reflections error:", error);
        return res.status(500).json({
        success: false,
        message: "Something went wrong while fetching reflections",
        });
    }
}

async function getReflectionById(req, res) {
    try {
        const userId = req.user.id;
        const {id} = req.params;

        const result = await pool.query(`SELECT id, user_id, content, mood, source, created_at, updated_at FROM reflections WHERE id = $1 AND user_id = $2`, [id, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
              success: false,
              message: "Reflection not found",
            });
          }
      
        return res.json({
            success: true,
            message: "Reflection fetched successfully",
            data: {
              reflection: result.rows[0],
            },
        });

    } catch(error) {
        console.error("Get reflections error:", error);
        return res.status(500).json({
        success: false,
        message: "Something went wrong while fetching reflections",
        });
    }
}

async function updateReflection(req, res) {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { content, mood } = req.body;
  
        const existingReflection = await pool.query(
            `SELECT id
            FROM reflections
            WHERE id = $1 AND user_id = $2`,
            [id, userId]
        );
  
        if (existingReflection.rows.length === 0) {
            return res.status(404).json({
            success: false,
            message: "Reflection not found",
            });
        }
    
        const result = await pool.query(
            `UPDATE reflections
            SET
            content = COALESCE($1, content),
            mood = COALESCE($2, mood),
            updated_at = CURRENT_TIMESTAMP
            WHERE id = $3 AND user_id = $4
            RETURNING id, user_id, content, mood, source, created_at, updated_at`,
            [content, mood, id, userId]
        );
  
        return res.json({
            success: true,
            message: "Reflection updated successfully",
            data: {
            reflection: result.rows[0],
            },
        });
    } catch (error) {
        console.error("Update reflection error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating reflection",
        });
    }
  }

async function deleteReflection(req, res) {
    try {
        const userId = req.user.id;
        const { id } = req.params;
    
        const result = await pool.query(
            `DELETE FROM reflections
            WHERE id = $1 AND user_id = $2
            RETURNING id`,
            [id, userId]
        );
    
        if (result.rows.length === 0) {
            return res.status(404).json({
            success: false,
            message: "Reflection not found",
            });
        }
    
        return res.json({
            success: true,
            message: "Reflection deleted successfully",
            data: {
            deletedReflectionId: result.rows[0].id,
            },
        });
    } catch (error) {
        console.error("Delete reflection error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting reflection",
        });
    }
}

module.exports = {createReflection, getReflections, getReflectionById, updateReflection, deleteReflection};