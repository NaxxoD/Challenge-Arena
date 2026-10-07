# Challenge Arena API

API REST pour organiser des défis techniques entre participants et afficher un classement public.

Projet académique réalisé en duo, 2025/2026.

---

## Installation et lancement

### Avant le premier lancement

Le fichier des participants n'est pas versionné (il contient des données de runtime). Il doit exister, avec une liste vide :

```bash
echo "[]" > data/participants.json
```

Sans ce fichier, les routes `/participants` et `/classement` renvoient une erreur. `data/validations.json` est créé automatiquement à la première validation. `data/defis.json` est fourni dans le dépôt.

### Sans Docker

**Prérequis :** Node.js 20+

```bash
npm install
npm run dev
```

### Avec Docker

**Prérequis :** Docker Desktop

```bash
docker compose up --build
```

Le serveur démarre sur **http://localhost:3000**

---

## Endpoints

### Participants

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/participants` | Lister tous les participants |
| `POST` | `/participants` | Créer un participant |

**Créer un participant**
```json
POST /participants
{ "nom": "Alice" }
```

### Défis

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/defis` | Lister tous les défis |
| `GET` | `/defis/:id` | Récupérer un défi |
| `POST` | `/defis` | Créer un défi |
| `POST` | `/defis/:id/valider` | Valider un défi pour un participant |

**Créer un défi**
```json
POST /defis
{ "titre": "FizzBuzz", "difficulte": "facile", "points": 10 }
```
> `difficulte` accepte : `facile`, `moyen`, `difficile`, `expert`

**Valider un défi**
```json
POST /defis/1/valider
{ "participantId": "<uuid-du-participant>" }
```

### Classement

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/classement` | Classement trié par points décroissants |

---

## Scénario de démo complet

### 1. Créer deux participants

```bash
curl -X POST http://localhost:3000/participants \
  -H "Content-Type: application/json" \
  -d '{"nom": "Alice"}'

curl -X POST http://localhost:3000/participants \
  -H "Content-Type: application/json" \
  -d '{"nom": "Bob"}'
```

### 2. Vérifier la liste des défis disponibles

```bash
curl http://localhost:3000/defis
```

### 3. Créer un défi personnalisé

```bash
curl -X POST http://localhost:3000/defis \
  -H "Content-Type: application/json" \
  -d '{"titre": "Hello World", "difficulte": "facile", "points": 10}'
```

### 4. Valider des défis pour les participants

> Remplacer `<id-alice>` et `<id-bob>` par les UUIDs retournés à l'étape 1.

```bash
# Alice valide le défi 1 (10 pts)
curl -X POST http://localhost:3000/defis/1/valider \
  -H "Content-Type: application/json" \
  -d '{"participantId": "<id-alice>"}'

# Alice valide le défi 2 (15 pts)
curl -X POST http://localhost:3000/defis/2/valider \
  -H "Content-Type: application/json" \
  -d '{"participantId": "<id-alice>"}'

# Bob valide le défi 1 (10 pts)
curl -X POST http://localhost:3000/defis/1/valider \
  -H "Content-Type: application/json" \
  -d '{"participantId": "<id-bob>"}'
```

### 5. Afficher le classement

```bash
curl http://localhost:3000/classement
```

Résultat attendu :
```json
[
  { "rang": 1, "id": "<id-alice>", "nom": "Alice", "points": 25, "defisValides": 2 },
  { "rang": 2, "id": "<id-bob>", "nom": "Bob", "points": 10, "defisValides": 1 }
]
```

---

## Gestion des erreurs

| Code | Cas |
|---|---|
| `400` | Champ manquant, type invalide, défi déjà validé, nom en doublon |
| `404` | Défi ou participant introuvable |
| `500` | Erreur serveur inattendue |

---

## Structure du projet

```
app.js                  Point d'entrée Express
Routers/                Définition des routes
Controllers/            Gestion HTTP (req/res)
Services/               Logique métier
Models/                 Accès aux fichiers JSON
data/
  defis.json            Défis disponibles
  participants.json     Participants et leurs points
  validations.json      Historique des validations
```

---

## Auteurs

Elyas L — Arno D
