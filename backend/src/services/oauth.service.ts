import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

export default class OAuthService {
  static async getAccessToken(code: string) {
    const res = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    return res.data.access_token;
  }

  static async getUserData(accessToken: string) {
    const res = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });
    return res.data;
  }
}


