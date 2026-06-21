const pool = require("../config/db");

async function ensureLifeMomentBelongsToUser(lifeMomentId, userId) {
    const result = await pool.query(
        `SELECT id
        FROM life_moments
        WHERE id = $1 AND user_id = $2`,
        [lifeMomentId, userId]
    );

    return result.rows.length > 0;
}


async function addLifeMomentEmotion(req, res) {
  try {
    const userId = req.user.id;
    const lifeMomentId = req.params.id;
    const { tagId, confidence } = req.body;

    const ownsLifeMoment = await ensureLifeMomentBelongsToUser(
      lifeMomentId,
      userId
    );

    if (!ownsLifeMoment) {
      return res.status(404).json({
        success: false,
        message: "Life moment not found",
      });
    }

    const result = await pool.query(
      `INSERT INTO life_moment_emotions
        (life_moment_id, emotion_id, confidence, source)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (life_moment_id, emotion_id)
       DO UPDATE SET confidence = EXCLUDED.confidence
       RETURNING id, life_moment_id, emotion_id, confidence, source, created_at`,
      [lifeMomentId, tagId, confidence || null, "manual"]
    );

    return res.status(201).json({
      success: true,
      message: "Emotion added to life moment successfully",
      data: {
        lifeMomentEmotion: result.rows[0],
      },
    });
  } catch (error) {
    console.error("Add life moment emotion error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while adding emotion",
    });
  }
}

async function getLifeMomentEmotions(req, res) {
  try {
    const userId = req.user.id;
    const lifeMomentId = req.params.id;

    const ownsLifeMoment = await ensureLifeMomentBelongsToUser(
      lifeMomentId,
      userId
    );

    if (!ownsLifeMoment) {
      return res.status(404).json({
        success: false,
        message: "Life moment not found",
      });
    }

    const result = await pool.query(
      `SELECT 
        e.id,
        e.name,
        e.description,
        lme.confidence,
        lme.source,
        lme.created_at
       FROM life_moment_emotions lme
       JOIN emotions e ON e.id = lme.emotion_id
       WHERE lme.life_moment_id = $1
       ORDER BY e.name ASC`,
      [lifeMomentId]
    );

    return res.json({
      success: true,
      message: "Life moment emotions fetched successfully",
      data: {
        emotions: result.rows,
      },
    });
  } catch (error) {
    console.error("Get life moment emotions error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching emotions",
    });
  }
}

async function removeLifeMomentEmotion(req, res) {
  try {
    const userId = req.user.id;
    const lifeMomentId = req.params.id;
    const emotionId = req.params.emotionId;

    const ownsLifeMoment = await ensureLifeMomentBelongsToUser(
      lifeMomentId,
      userId
    );

    if (!ownsLifeMoment) {
      return res.status(404).json({
        success: false,
        message: "Life moment not found",
      });
    }

    const result = await pool.query(
      `DELETE FROM life_moment_emotions
       WHERE life_moment_id = $1 AND emotion_id = $2
       RETURNING id`,
      [lifeMomentId, emotionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Emotion tag not found on this life moment",
      });
    }

    return res.json({
      success: true,
      message: "Emotion removed from life moment successfully",
      data: {
        deletedId: result.rows[0].id,
      },
    });
  } catch (error) {
    console.error("Remove life moment emotion error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while removing emotion",
    });
  }
}

async function addLifeMomentTheme(req, res) {
  try {
    const userId = req.user.id;
    const lifeMomentId = req.params.id;
    const { tagId, confidence } = req.body;

    const ownsLifeMoment = await ensureLifeMomentBelongsToUser(
      lifeMomentId,
      userId
    );

    if (!ownsLifeMoment) {
      return res.status(404).json({
        success: false,
        message: "Life moment not found",
      });
    }

    const result = await pool.query(
      `INSERT INTO life_moment_themes
        (life_moment_id, theme_id, confidence, source)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (life_moment_id, theme_id)
       DO UPDATE SET confidence = EXCLUDED.confidence
       RETURNING id, life_moment_id, theme_id, confidence, source, created_at`,
      [lifeMomentId, tagId, confidence || null, "manual"]
    );

    return res.status(201).json({
      success: true,
      message: "Theme added to life moment successfully",
      data: {
        lifeMomentTheme: result.rows[0],
      },
    });
  } catch (error) {
    console.error("Add life moment theme error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while adding theme",
    });
  }
}

async function getLifeMomentThemes(req, res) {
  try {
    const userId = req.user.id;
    const lifeMomentId = req.params.id;

    const ownsLifeMoment = await ensureLifeMomentBelongsToUser(
      lifeMomentId,
      userId
    );

    if (!ownsLifeMoment) {
      return res.status(404).json({
        success: false,
        message: "Life moment not found",
      });
    }

    const result = await pool.query(
      `SELECT 
        t.id,
        t.name,
        t.description,
        lmt.confidence,
        lmt.source,
        lmt.created_at
       FROM life_moment_themes lmt
       JOIN themes t ON t.id = lmt.theme_id
       WHERE lmt.life_moment_id = $1
       ORDER BY t.name ASC`,
      [lifeMomentId]
    );

    return res.json({
      success: true,
      message: "Life moment themes fetched successfully",
      data: {
        themes: result.rows,
      },
    });
  } catch (error) {
    console.error("Get life moment themes error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching themes",
    });
  }
}

async function removeLifeMomentTheme(req, res) {
  try {
    const userId = req.user.id;
    const lifeMomentId = req.params.id;
    const themeId = req.params.themeId;

    const ownsLifeMoment = await ensureLifeMomentBelongsToUser(
      lifeMomentId,
      userId
    );

    if (!ownsLifeMoment) {
      return res.status(404).json({
        success: false,
        message: "Life moment not found",
      });
    }

    const result = await pool.query(
      `DELETE FROM life_moment_themes
       WHERE life_moment_id = $1 AND theme_id = $2
       RETURNING id`,
      [lifeMomentId, themeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Theme tag not found on this life moment",
      });
    }

    return res.json({
      success: true,
      message: "Theme removed from life moment successfully",
      data: {
        deletedId: result.rows[0].id,
      },
    });
  } catch (error) {
    console.error("Remove life moment theme error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while removing theme",
    });
  }
}

async function addLifeMomentValue(req, res) {
  try {
    const userId = req.user.id;
    const lifeMomentId = req.params.id;
    const { tagId, confidence } = req.body;

    const ownsLifeMoment = await ensureLifeMomentBelongsToUser(
      lifeMomentId,
      userId
    );

    if (!ownsLifeMoment) {
      return res.status(404).json({
        success: false,
        message: "Life moment not found",
      });
    }

    const result = await pool.query(
      `INSERT INTO life_moment_values
        (life_moment_id, value_id, confidence, source)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (life_moment_id, value_id)
       DO UPDATE SET confidence = EXCLUDED.confidence
       RETURNING id, life_moment_id, value_id, confidence, source, created_at`,
      [lifeMomentId, tagId, confidence || null, "manual"]
    );

    return res.status(201).json({
      success: true,
      message: "Value added to life moment successfully",
      data: {
        lifeMomentValue: result.rows[0],
      },
    });
  } catch (error) {
    console.error("Add life moment value error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while adding value",
    });
  }
}

async function getLifeMomentValues(req, res) {
  try {
    const userId = req.user.id;
    const lifeMomentId = req.params.id;

    const ownsLifeMoment = await ensureLifeMomentBelongsToUser(
      lifeMomentId,
      userId
    );

    if (!ownsLifeMoment) {
      return res.status(404).json({
        success: false,
        message: "Life moment not found",
      });
    }

    const result = await pool.query(
      `SELECT 
        v.id,
        v.name,
        v.description,
        lmv.confidence,
        lmv.source,
        lmv.created_at
       FROM life_moment_values lmv
       JOIN values v ON v.id = lmv.value_id
       WHERE lmv.life_moment_id = $1
       ORDER BY v.name ASC`,
      [lifeMomentId]
    );

    return res.json({
      success: true,
      message: "Life moment values fetched successfully",
      data: {
        values: result.rows,
      },
    });
  } catch (error) {
    console.error("Get life moment values error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching values",
    });
  }
}

async function removeLifeMomentValue(req, res) {
  try {
    const userId = req.user.id;
    const lifeMomentId = req.params.id;
    const valueId = req.params.valueId;

    const ownsLifeMoment = await ensureLifeMomentBelongsToUser(
      lifeMomentId,
      userId
    );

    if (!ownsLifeMoment) {
      return res.status(404).json({
        success: false,
        message: "Life moment not found",
      });
    }

    const result = await pool.query(
      `DELETE FROM life_moment_values
       WHERE life_moment_id = $1 AND value_id = $2
       RETURNING id`,
      [lifeMomentId, valueId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Value tag not found on this life moment",
      });
    }

    return res.json({
      success: true,
      message: "Value removed from life moment successfully",
      data: {
        deletedId: result.rows[0].id,
      },
    });
  } catch (error) {
    console.error("Remove life moment value error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while removing value",
    });
  }
}

module.exports = {
  addLifeMomentEmotion,
  getLifeMomentEmotions,
  removeLifeMomentEmotion,

  addLifeMomentTheme,
  getLifeMomentThemes,
  removeLifeMomentTheme,

  addLifeMomentValue,
  getLifeMomentValues,
  removeLifeMomentValue,
};