// imports zod pour la validation et le model défis #elyas
import { z } from 'zod';
import * as Defi from '../Models/defi.js';

// schéma zod qui déclare les types et règles attendus pour créer un défi #elyas
const defiSchema = z.object({
  titre: z.string().min(1, 'titre est requis'),
  difficulte: z.enum(['facile', 'moyen', 'difficile', 'expert'], {
    message: "difficulte doit être parmi : facile, moyen, difficile, expert",
  }),
  points: z.number({ message: 'points doit être un nombre' }).positive('points doit être positif'),
});

// utilitaire qui crée une erreur avec un code HTTP, propagée jusqu'au handler global #elyas
function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

// service qui retourne tous les défis depuis le model #elyas
export function listerDefis() {
  return Defi.findAll();
}

// service qui retourne un défi par id, lève un 404 s'il n'existe pas #elyas
export function getDefi(id) {
  const defi = Defi.findById(id);
  if (!defi) throw httpError(404, 'Défi introuvable');
  return defi;
}

// service qui valide le body avec zod puis délègue la création au model #elyas
export function creerDefi(body) {
  // safeParse ne lève pas d'exception, il retourne { success, data, error } #elyas
  const result = defiSchema.safeParse(body);
  if (!result.success) {
    throw httpError(400, result.error.issues.map(i => i.message).join(', '));
  }
  return Defi.create(result.data);
}
