const {z} = require('zod');

const createLifeMomentSchema = z.object({
    title: z.string().max(160, "Title must be under 160 characters").optional(),

    content: z.string().min(1, "Life moment content is required").max(8000, "Life moment must be under 8000 characters"),

    occurred_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Occurred date must be in YYYY-MM-DD format").optional(),

    emotional_tone: z.string().max(80, "Emotional tone must be under 80 characters").optional(),
});

const updateLifeMomentSchema = z.object({
    title: z.string().max(160, "Title must be under 160 characters").optional(),
  
    content: z.string().min(1, "Life moment content cannot be empty").max(8000, "Life moment must be under 8000 characters").optional(),
  
    occurred_at: z.date("Occurred date must be in YYYY-MM-DD format").optional(),
  
    emotional_tone: z.string().max(80, "Emotional tone must be under 80 characters").optional(),
});
  
module.exports = {createLifeMomentSchema, updateLifeMomentSchema};