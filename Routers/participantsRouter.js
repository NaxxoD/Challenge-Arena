import { Router } from 'express';
import * as controller from '../Controllers/participantsControllers.js';

const router = Router();

router.post('/', controller.creerParticipant);
router.get('/', controller.listerParticipants);

export default router;
