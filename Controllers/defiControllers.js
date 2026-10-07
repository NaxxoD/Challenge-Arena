// importe toutes les fonctions du service défis #elyas
import * as DefiService from '../Services/DefiService.js';

// controller qui retourne la liste de tous les défis #elyas
export function listerDefis(req, res, next) {
  try {
    res.json(DefiService.listerDefis());
  } catch (err) {
    // propage l'erreur au handler global de app.js #elyas
    next(err);
  }
}

// controller qui retourne un défi par son id #elyas
export function getDefi(req, res, next) {
  try {
    res.json(DefiService.getDefi(req.params.id));
  } catch (err) {
    next(err);
  }
}

// controller qui crée un défi à partir du body de la requête #elyas
export function creerDefi(req, res, next) {
  try {
    // 201 Created : statut HTTP correct pour une création réussie #elyas
    res.status(201).json(DefiService.creerDefi(req.body));
  } catch (err) {
    next(err);
  }
}