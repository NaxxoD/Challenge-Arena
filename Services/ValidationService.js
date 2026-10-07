// imports zod, fs et chemins des fichiers JSON #elyas
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PARTICIPANTS_PATH = path.join(__dirname, '../data/participants.json');
const DEFIS_PATH = path.join(__dirname, '../data/defis.json');
const VALIDATIONS_PATH = path.join(__dirname, '../data/validations.json');

// schéma zod qui vérifie que participantId est une string non vide (UUID) #elyas
const validerSchema = z.object({
  participantId: z.string().min(1, 'participantId est requis'),
});

// utilitaire qui crée une erreur avec un code HTTP, propagée jusqu'au handler global #elyas
function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function lireParticipants() {
  return JSON.parse(fs.readFileSync(PARTICIPANTS_PATH, 'utf-8'));
}

function lireDefis() {
  return JSON.parse(fs.readFileSync(DEFIS_PATH, 'utf-8'));
}

function ecrireParticipants(data) {
  fs.writeFileSync(PARTICIPANTS_PATH, JSON.stringify(data, null, 2));
}

function lireValidations() {
  if (!fs.existsSync(VALIDATIONS_PATH)) return [];
  return JSON.parse(fs.readFileSync(VALIDATIONS_PATH, 'utf-8'));
}

function ecrireValidations(data) {
  fs.writeFileSync(VALIDATIONS_PATH, JSON.stringify(data, null, 2));
}

// service appelé par POST /defis/:id/valider — body { participantId } #elyas
export function validerDepuisDefi(defiId, participantId) {
  const result = validerSchema.safeParse({ participantId });
  if (!result.success) {
    throw httpError(400, result.error.issues.map(i => i.message).join(', '));
  }

  const defis = lireDefis();
  const defi = defis.find(d => String(d.id) === String(defiId));
  if (!defi) throw httpError(404, 'Défi introuvable');

  const participants = lireParticipants();
  const participant = participants.find(p => String(p.id) === String(participantId));
  if (!participant) throw httpError(404, 'Participant introuvable');

  // service qui empêche de valider deux fois le même défi #elyas
  if (participant.defisValides.includes(defi.id)) {
    throw httpError(400, 'Ce défi a déjà été validé par ce participant');
  }

  // service qui met à jour le participant et enregistre la validation #elyas
  participant.defisValides.push(defi.id);
  participant.points += defi.points;
  ecrireParticipants(participants);

  const validations = lireValidations();
  const id = validations.length > 0 ? Math.max(...validations.map(v => v.id)) + 1 : 1;
  const validation = {
    id,
    defiId: defi.id,
    participantId: String(participantId),
    // format ISO UTC pour la date, triable et standard #elyas
    validatedAt: new Date().toISOString(),
  };
  validations.push(validation);
  ecrireValidations(validations);

  return { validation, pointsGagnes: defi.points };
}

