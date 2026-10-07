import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import { z } from 'zod';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, '../data/participants.json');

const schemaParticipant = z.object({
    nom: z.string().min(1, 'Le champ "nom" est obligatoire'),
});

function lire() {
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
}

function ecrire(data) {
	fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

export function creerParticipant(nom) {
    const resultat = schemaParticipant.safeParse({ nom });
    if (!resultat.success) {
    throw new Error(resultat.error.issues.map(i => i.message).join(', '));
}

const participants = lire();
const nomNettoye = nom.trim();

    /* toLowerCase() des deux côtés pour une comparaison insensible à la casse
    évite "alice" et "Alice" comme deux participants distincts  # AD */ 
	const doublon = participants.find(
    (p) => p.nom.toLowerCase() === nomNettoye.toLowerCase()
);
if (doublon) {
    throw new Error('Un participant avec ce nom existe déjà');
}

const nouveau = {
    id: randomUUID(),
    nom: nomNettoye,
    points: 0,
    defisValides: [],
};

participants.push(nouveau);
ecrire(participants);

return nouveau;
}

export function listerParticipants() {
return lire();
}
