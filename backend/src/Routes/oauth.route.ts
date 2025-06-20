import { Router } from "express";
import OAuthController from "../Controllers/oauth.controller";

const router = Router();

router.get("/github", OAuthController.redirectToGitHub);
router.get("/github/callback", OAuthController.handleGitHubCallback);

// handles the route for github repositories
router.get("/github/repositories", OAuthController.getrepsitories);

// routes/github.routes.ts
router.get("/me", (req, res) => {
  if (req.session.token) {
    res.json({ loggedIn: true, user: { username: req.session.user } });
  } else {
    res.json({ loggedIn: false });
  }
});

export default router;
