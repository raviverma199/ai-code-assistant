import { Request, Response } from "express";
import { judege0Service } from "../services/judege0.service";



export const runCode = async (req: Request, res: Response) => {
  const { code, language } = req.body;

  try {
    const result = await judege0Service.runCode({
      source_code: code,
      language: language || 'javascript',
      input: req.body.input || ''
    });
    res.json({ output: result });
  } catch (error: any) {
    res.status(500).json({ error: 'Execution failed', message: error.message });
  }
};