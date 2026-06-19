const { z } = require("zod");

const tagSchema = z.object({
    tagId: z.string().uuid("tagId must be a valid UUID"),
    confidence: z.number().min(0, "Confidence cannot be below 0").max(1, "Confidence cannot be above 1").optional(),
});
  
module.exports = {tagSchema};