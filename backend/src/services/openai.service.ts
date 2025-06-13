import { OpenAI } from "openai";
import * as dotenv from "dotenv";
dotenv.config();

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

class getAIResponse {
  static async getResponse(code: string,action: string,language: string): Promise<string> {
    try {
      let prompt = "";

      switch (action) {
        case "Refactor Code":
          prompt = `Expali the problem and Refactor this ${language} code:\n\n${code}`;
          break;
        case "Explain Logic":
          prompt = `Explain the logic of this ${language} code:\n\n${code}`;
          break;
        case "Fix Errors":
          prompt = `Find and fix errors in this ${language} code. Explain the fixes too:\n\n${code}`;
          break;
        case "Suggest Improvements":
          prompt = `Suggest improvements for this ${language} code:\n\n${code}`;
          break;
        default:
          throw new Error("Invalid action");
      }

      const response = await openaiClient.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      });

      return response.choices[0]?.message?.content || "No AI response.";
    } catch (error) {
      throw new Error(
        `Failed to get AI response: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
}

export default getAIResponse;
