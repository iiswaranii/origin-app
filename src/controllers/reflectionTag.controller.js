const pool = require("../config/db");

async function ensureReflectionBelongsToUser(reflectionId, userId) {
    const result = await pool.query(
      `SELECT id
       FROM reflections
       WHERE id = $1 AND user_id = $2`,
      [reflectionId, userId]
    );
  
    return result.rows.length > 0;
}

async function addReflectionEmotion (req, res) {
    try {
        const userId = req.user.id;
        const reflectionId = req.params.id;
        const { tagId, confidence } = req.body;

        const ownsReflection = await ensureReflectionBelongsToUser(reflectionId, userId);
        
        if (!ownsReflection) {
            return res.status(404).json({
                success: false,
                message: "Reflection not found",
            });
        }

        const result = await pool.query(
            `INSERT INTO reflection_emotions
              (reflection_id, emotion_id, confidence, source)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (reflection_id, emotion_id)
             DO UPDATE SET confidence = EXCLUDED.confidence
             RETURNING id, reflection_id, emotion_id, confidence, source, created_at`,
            [reflectionId, tagId, confidence || null, "manual"]
        );

        return res.status(201).json({
            success: true,
            message: "Emotion added to reflection successfully",
            data: {
              reflectionEmotion: result.rows[0],
            },
        });

    }catch (error) {
        console.error("Add reflection emotion error:", error);
        return res.status(500).json({
        success: false,
        message: "Something went wrong while adding emotion",
        });

    }
}

async function getReflectionEmotions(req, res) {
    try {
        const userId = req.user.id;
        const reflectionId = req.params.id;
    
        const ownsReflection = await ensureReflectionBelongsToUser(
            reflectionId,
            userId
        );
  
        if (!ownsReflection) {
            return res.status(404).json({
                success: false,
                message: "Reflection not found",
            });
        }
  
        const result = await pool.query(
            `SELECT 
            e.id,
            e.name,
            e.description,
            re.confidence,
            re.source,
            re.created_at
            FROM reflection_emotions re
            JOIN emotions e ON e.id = re.emotion_id
            WHERE re.reflection_id = $1
            ORDER BY e.name ASC`,
            [reflectionId]
        );
  
        return res.json({
            success: true,
            message: "Reflection emotions fetched successfully",
            data: {
            emotions: result.rows,
            },
        });
    } catch (error) {
      console.error("Get reflection emotions error:", error);
      return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching emotions",
      });
    }
}

async function removeReflectionEmotion(req, res) {
    try {
        const userId = req.user.id;
        const reflectionId = req.params.id;
        const emotionId = req.params.emotionId;
    
        const ownsReflection = await ensureReflectionBelongsToUser(
            reflectionId,
            userId
        );
    
        if (!ownsReflection) {
            return res.status(404).json({
            success: false,
            message: "Reflection not found",
            });
        }
    
        const result = await pool.query(
            `DELETE FROM reflection_emotions
            WHERE reflection_id = $1 AND emotion_id = $2
            RETURNING id`,
            [reflectionId, emotionId]
        );
    
        if (result.rows.length === 0) {
            return res.status(404).json({
            success: false,
            message: "Emotion tag not found on this reflection",
            });
        }
    
        return res.json({
            success: true,
            message: "Emotion removed from reflection successfully",
            data: {
            deletedId: result.rows[0].id,
            },
        });
    } catch (error) {
        console.error("Remove reflection emotion error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while removing emotion",
        });
    }
}

async function addReflectionTheme(req, res) {
    try {
      const userId = req.user.id;
      const reflectionId = req.params.id;
      const { tagId, confidence } = req.body;
  
      const ownsReflection = await ensureReflectionBelongsToUser(
        reflectionId,
        userId
      );
  
      if (!ownsReflection) {
        return res.status(404).json({
          success: false,
          message: "Reflection not found",
        });
      }
  
      const result = await pool.query(
        `INSERT INTO reflection_themes
          (reflection_id, theme_id, confidence, source)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (reflection_id, theme_id)
         DO UPDATE SET confidence = EXCLUDED.confidence
         RETURNING id, reflection_id, theme_id, confidence, source, created_at`,
        [reflectionId, tagId, confidence || null, "manual"]
      );
  
      return res.status(201).json({
        success: true,
        message: "Theme added to reflection successfully",
        data: {
          reflectionTheme: result.rows[0],
        },
      });
    } catch (error) {
      console.error("Add reflection theme error:", error);
  
      return res.status(500).json({
        success: false,
        message: "Something went wrong while adding theme",
      });
    }
  }
  
  async function getReflectionThemes(req, res) {
    try {
      const userId = req.user.id;
      const reflectionId = req.params.id;
  
      const ownsReflection = await ensureReflectionBelongsToUser(
        reflectionId,
        userId
      );
  
      if (!ownsReflection) {
        return res.status(404).json({
          success: false,
          message: "Reflection not found",
        });
      }
  
      const result = await pool.query(
        `SELECT 
          t.id,
          t.name,
          t.description,
          rt.confidence,
          rt.source,
          rt.created_at
         FROM reflection_themes rt
         JOIN themes t ON t.id = rt.theme_id
         WHERE rt.reflection_id = $1
         ORDER BY t.name ASC`,
        [reflectionId]
      );
  
      return res.json({
        success: true,
        message: "Reflection themes fetched successfully",
        data: {
          themes: result.rows,
        },
      });
    } catch (error) {
      console.error("Get reflection themes error:", error);
  
      return res.status(500).json({
        success: false,
        message: "Something went wrong while fetching themes",
      });
    }
  }
  
  async function removeReflectionTheme(req, res) {
    try {
      const userId = req.user.id;
      const reflectionId = req.params.id;
      const themeId = req.params.themeId;
  
      const ownsReflection = await ensureReflectionBelongsToUser(
        reflectionId,
        userId
      );
  
      if (!ownsReflection) {
        return res.status(404).json({
          success: false,
          message: "Reflection not found",
        });
      }
  
      const result = await pool.query(
        `DELETE FROM reflection_themes
         WHERE reflection_id = $1 AND theme_id = $2
         RETURNING id`,
        [reflectionId, themeId]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Theme tag not found on this reflection",
        });
      }
  
      return res.json({
        success: true,
        message: "Theme removed from reflection successfully",
        data: {
          deletedId: result.rows[0].id,
        },
      });
    } catch (error) {
      console.error("Remove reflection theme error:", error);
  
      return res.status(500).json({
        success: false,
        message: "Something went wrong while removing theme",
      });
    }
  }
  
  async function addReflectionValue(req, res) {
    try {
      const userId = req.user.id;
      const reflectionId = req.params.id;
      const { tagId, confidence } = req.body;
  
      const ownsReflection = await ensureReflectionBelongsToUser(
        reflectionId,
        userId
      );
  
      if (!ownsReflection) {
        return res.status(404).json({
          success: false,
          message: "Reflection not found",
        });
      }
  
      const result = await pool.query(
        `INSERT INTO reflection_values
          (reflection_id, value_id, confidence, source)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (reflection_id, value_id)
         DO UPDATE SET confidence = EXCLUDED.confidence
         RETURNING id, reflection_id, value_id, confidence, source, created_at`,
        [reflectionId, tagId, confidence || null, "manual"]
      );
  
      return res.status(201).json({
        success: true,
        message: "Value added to reflection successfully",
        data: {
          reflectionValue: result.rows[0],
        },
      });
    } catch (error) {
      console.error("Add reflection value error:", error);
  
      return res.status(500).json({
        success: false,
        message: "Something went wrong while adding value",
      });
    }
  }
  
  async function getReflectionValues(req, res) {
    try {
      const userId = req.user.id;
      const reflectionId = req.params.id;
  
      const ownsReflection = await ensureReflectionBelongsToUser(
        reflectionId,
        userId
      );
  
      if (!ownsReflection) {
        return res.status(404).json({
          success: false,
          message: "Reflection not found",
        });
      }
  
      const result = await pool.query(
        `SELECT 
          v.id,
          v.name,
          v.description,
          rv.confidence,
          rv.source,
          rv.created_at
         FROM reflection_values rv
         JOIN values v ON v.id = rv.value_id
         WHERE rv.reflection_id = $1
         ORDER BY v.name ASC`,
        [reflectionId]
      );
  
      return res.json({
        success: true,
        message: "Reflection values fetched successfully",
        data: {
          values: result.rows,
        },
      });
    } catch (error) {
      console.error("Get reflection values error:", error);
  
      return res.status(500).json({
        success: false,
        message: "Something went wrong while fetching values",
      });
    }
  }

  async function removeReflectionValue(req, res) {
    try {
      const userId = req.user.id;
      const reflectionId = req.params.id;
      const valueId = req.params.valueId;
  
      const ownsReflection = await ensureReflectionBelongsToUser(
        reflectionId,
        userId
      );
  
      if (!ownsReflection) {
        return res.status(404).json({
          success: false,
          message: "Reflection not found",
        });
      }
  
      const result = await pool.query(
        `DELETE FROM reflection_values
         WHERE reflection_id = $1 AND value_id = $2
         RETURNING id`,
        [reflectionId, valueId]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Value tag not found on this reflection",
        });
      }
  
      return res.json({
        success: true,
        message: "Value removed from reflection successfully",
        data: {
          deletedId: result.rows[0].id,
        },
      });
    } catch (error) {
      console.error("Remove reflection value error:", error);
  
      return res.status(500).json({
        success: false,
        message: "Something went wrong while removing value",
      });
    }
}

module.exports = {
    addReflectionEmotion,
    getReflectionEmotions,
    removeReflectionEmotion,
  
    addReflectionTheme,
    getReflectionThemes,
    removeReflectionTheme,
  
    addReflectionValue,
    getReflectionValues,
    removeReflectionValue,
};