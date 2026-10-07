// importe la fonction du service validation #elyas
import * as ValidationService from '../Services/validationService.js';

// controller qui valide un défi via POST /defis/:id/valider — participantId dans le body #elyas
export function validerDepuisDefi(req, res, next) {
  try {
    res.status(201).json(ValidationService.validerDepuisDefi(req.params.id, req.body.participantId));
  } catch (err) {
    next(err);
  }
}
