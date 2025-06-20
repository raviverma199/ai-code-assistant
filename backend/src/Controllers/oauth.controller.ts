import { Request, Response } from "express";
import OAuthService from "../services/oauth.service";

export default class OAuthController {
  static async redirectToGitHub(req: Request, res: Response): Promise<void> {
    const clientId = process.env.GITHUB_CLIENT_ID;
    if (!clientId) {
        res.status(500).send("GitHub Client ID is not configured.");
        return;
    }

    const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}`;
    res.redirect(redirectUrl);
  }


  static async handleGitHubCallback(req: Request, res: Response): Promise<void> {
    const code = req.query.code as string;
    if (!code) {
      res.status(400).send("Missing code parameter");
      return;
    }

    try {
      const accessToken = await OAuthService.getAccessToken(code);
      const userData = await OAuthService.getUserData(accessToken);

      if (!userData || !userData.login) {
            res.status(500).send("Failed to retrieve user data");
            return;
        }

        return res.redirect(`${process.env.FRONTEND_URL}?username=${userData.login}&avatar=${userData.avatar_url}&accessToken=${accessToken}`);

    } catch (error) {
      console.error("OAuth Error:", error);
      res.status(500).send("Authentication failed");
    }
  }
}