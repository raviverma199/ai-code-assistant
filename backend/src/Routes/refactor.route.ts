import { Router } from 'express';
import { refactorCodeController } from '../Controllers/refactor.controller';

const router = Router();

router.post('/refactor', refactorCodeController as any);

export default router;
