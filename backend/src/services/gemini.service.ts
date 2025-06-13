// gemini.service.ts
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

class GeminiService {
  static async getResponse(code: string, action: string, language: string): Promise<string> {
    try {
      let prompt = '';

     switch (action) {
  case 'Refactor Code':
prompt = `Refactor the following ${language} code. Respond in Markdown format. First explain the changes in bullet points. Then provide the full refactored code inside a proper code block:\n\n${code}`;
    break;
  case 'Explain Logic':
    prompt = `Explain the logic of the following ${language} code. Respond in Markdown format. Use normal text and code blocks where applicable:\n\n${code}`;
    break;
  case 'Fix Errors':
    prompt = `Find and fix errors in the following ${language} code. Respond in Markdown format. Use code blocks and clearly explain what was fixed:\n\n${code}`;
    break;
  case 'Suggest Improvements':
    prompt = `Suggest improvements for the following ${language} code. Respond in Markdown format. Use bullet points for suggestions and include code blocks for improved code:\n\n${code}`;
    break;
  case 'Optimize Performance':
    prompt = `Optimize the performance of the following ${language} code. Respond in Markdown format. Explain what was optimized and include improved code blocks:\n\n${code}`;
    break;
  default:
    throw new Error('Invalid action');
}


      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openai/gpt-3.5-turbo", // safer, more supported model
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
          },
        }
      );

      return response.data.choices?.[0]?.message?.content || "No response from AI";
    } catch (err: any) {
      console.error("🔥 Gemini Error:", err.response?.data || err.message);
      throw new Error("Gemini request failed: " + JSON.stringify(err.response?.data || err.message));
    }
  }
}

export default GeminiService;
