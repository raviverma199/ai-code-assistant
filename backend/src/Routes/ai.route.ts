import express from "express";
import { handleAIRequest } from "../Controllers/ai.controller";
import { handleGeminiRequest } from "../Controllers/ai.controller";

const router = express.Router();

// Route for OpenAI requests
router.post("/openai", handleAIRequest as express.RequestHandler);


// Route for Gemini AI requests
router.post("/gemini", handleGeminiRequest as express.RequestHandler);

export default router;
