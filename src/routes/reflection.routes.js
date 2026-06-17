const express = require('express');

const {createReflection, getReflections, getReflectionById, updateReflection, deleteReflection} = require("../controllers/reflection.controller");
  
const { requireAuth } = require("../middleware/auth.middleware");
  
const {createReflectionSchema, updateReflectionSchema} = require("../validations/reflection.validation");
  
const router = express.Router();

function validate(schema) {
    return function (req, res, next) {
      const result = schema.safeParse(req.body);
  
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: result.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });
      }
  
      req.body = result.data;
      next();
    };
  }
  
  router.use(requireAuth);
  
  router.post("/", validate(createReflectionSchema), createReflection);
  router.get("/", getReflections);
  router.get("/:id", getReflectionById);
  router.patch("/:id", validate(updateReflectionSchema), updateReflection);
  router.delete("/:id", deleteReflection);
  
  module.exports = router;