import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, '../data/participants.json');

export function getClassement() {
  const participants = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));

  return [...participants]
    .sort((a, b) => b.points - a.points)
    .map((p, index) => ({
      rang: index + 1,
      id: p.id,
      nom: p.nom,
      points: p.points,
      defisValides: p.defisValides.length,
    }));
}
