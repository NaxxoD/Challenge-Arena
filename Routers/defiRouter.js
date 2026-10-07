// import du router d'express #elyas
import { Router } from 'express';
// import des controllers défis et validation #elyas
import { listerDefis, getDefi, creerDefi } from '../Controllers/defiControllers.js';
import { validerDepuisDefi } from '../Controllers/validationController.js';

// crée une instance de router vide #elyas
const router = Router();

// routes relatives aux défis #elyas
router.get('/', listerDefis);
router.get('/:id', getDefi);
router.post('/', creerDefi);
router.post('/:id/valider', validerDepuisDefi);

export default router;
