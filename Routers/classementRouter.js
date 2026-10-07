import { Router } from 'express';
import * as controller from '../Controllers/classementControllers.js';

const router = Router();

router.get('/', controller.getClassement);

export default router;
