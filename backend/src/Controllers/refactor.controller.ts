import { Request, Response } from "express";
import { refactorCodeService } from "../services/coderefactor.service";
import prettier from "prettier";

export const refactorCodeController = async (req: Request, res: Response) => {
  try {
    let { code } = req.body;

    if (!code) return res.status(400).json({ error: "Code is required" });

     const formattedCode = await prettier.format(code, {
      semi: true,
      parser: 'babel',
      singleQuote: true,
    });

    const result = refactorCodeService(formattedCode);
    return res.status(200).json({ refactoredCode: result });

  } catch (err: any) {
    console.log(err)
    return res.status(500).json({ error: "Something went wrong during refactoring", err: err });
  }
};
