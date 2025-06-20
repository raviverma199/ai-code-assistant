import { Request, Response } from "express";
import OAuthService from "../services/oauth.service";
import axios from "axios";
import "express-session";

declare module "express-session" {
  interface SessionData {
    token?: string;
    user?: string
  }
}

export default class OAuthController {
  static async redirectToGitHub(req: Request, res: Response): Promise<void> {
    try {
      const clientId = process.env.GITHUB_CLIENT_ID;
      if (!clientId) {
        res.status(500).send("GitHub Client ID is not configured.");
        return;
      }

      const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}`;
      res.redirect(redirectUrl);
    } catch (error) {
      res.status(500).send("Failed to redirect to GitHub for authentication");
      console.error("Redirect Error:", error);
    }
  }

  // Handles the callback from GitHub after user authentication
  static async handleGitHubCallback(
    req: Request,
    res: Response
  ): Promise<void> {
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

      req.session.token = accessToken;
      req.session.user = userData?.login;

      return res.redirect(
        `${process.env.FRONTEND_URL}?username=${userData.login}&avatar=${userData.avatar_url}&accessToken=${accessToken}`
      );
    } catch (error) {
      console.error("OAuth Error:", error);
      res.status(500).send("Authentication failed");
    }
  }

  // Retrieves repositories of the authenticated user
  static async getrepsitories(req: Request, res: Response): Promise<void> {
    try {
      const token = req.session.token;
      if (!token) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const { data } = await axios.get("https://api.github.com/user/repos", {
        headers: { Authorization: `token ${token}` },
      });

      res.json({ repos: data });
    } catch (error) {
        res
        .status(500)
        .json({ success: false, message: "Failed to fetch repositories" });
    }
  }
}
