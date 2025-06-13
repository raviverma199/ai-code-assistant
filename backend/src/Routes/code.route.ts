import { Router } from 'express';
import { runCode } from '../Controllers/code.controller';

const router = Router();

router.post('/run', runCode as any);

export default router;