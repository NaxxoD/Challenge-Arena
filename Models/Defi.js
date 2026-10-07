// readFileSync et writeFileSync : lecture/écriture synchrone de fichiers #elyas
import { readFileSync, writeFileSync } from 'fs';

// chemin vers le fichier JSON des défis #elyas
const PATH = './data/defis.json';

// model qui lit defis.json et retourne un tableau d'objets JS #elyas
function read() {
  return JSON.parse(readFileSync(PATH, 'utf-8'));
}

// model qui sérialise et écrit le tableau dans defis.json #elyas
function write(data) {
  writeFileSync(PATH, JSON.stringify(data, null, 2));
}

// model qui retourne tous les défis #elyas
export function findAll() {
  return read();
}

// model qui cherche un défi par id, parseInt car l'id de l'url arrive en string #elyas
export function findById(id) {
  return read().find(d => d.id === parseInt(id));
}

// model qui génère un id, construit et persiste le nouveau défi #elyas
export function create({ titre, difficulte, points }) {
  const defis = read();
  // Math.max sur les ids existants pour éviter les doublons en cas de suppression #elyas
  const id = defis.length > 0 ? Math.max(...defis.map(d => d.id)) + 1 : 1;
  const defi = { id, titre, difficulte, points };
  defis.push(defi);
  write(defis);
  return defi;
}
