import { Request, Response } from "express";
import getAIResponse from "../services/openai.service";
import GeminiService from "../services/gemini.service";

// Controller AI response handler of OPENAI
export const handleAIRequest = async (req: Request, res: Response) => {
  const { code, action, language } = req.body;

  try {
    const result = await getAIResponse.getResponse(code, action, language);
    res.json({ output: result });
  } catch (error: any) {
    console.error("AI Error:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to process AI response" });
  }
};

// Controller for Gemini or OpenRouter
export const handleGeminiRequest = async (req: Request, res: Response) => {
  const { code, action, language } = req.body;
  console.log("Received Gemini request:", { code, action, language });

  if (!code || !action || !language) {
    return res
      .status(400)
      .json({ message: "Missing code, action, or language." });
  }

  try {
    const result = await GeminiService.getResponse(code, action, language);
    res.status(200).json({ result }); // Don't send { output: result }
  } catch (error: any) {
    console.error("Gemini AI Error:", error.response?.data || error.message);
    res.status(500).json({
      error: error.message || "Failed to process Gemini AI response",
    });
  }
};
