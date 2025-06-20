import { Router} from "express";
import OAuthController from "../Controllers/oauth.controller";

const router = Router();

router.get('/github', OAuthController.redirectToGitHub);
router.get('/github/callback', OAuthController.handleGitHubCallback);

export default router;