// imports express, morgan et les routers #elyas
import express from 'express';
import morgan from 'morgan';
import participantsRouter from './Routers/participantsRouter.js';
import classementRouter from './Routers/classementRouter.js';
import defiRouter from './Routers/defiRouter.js';

// crée l'instance d'application #elyas
const app = express();
// lit la variable d'environnement PORT définie dans docker-compose.yml #elyas
const PORT = process.env.PORT || 3000;

// middleware de logging #elyas
app.use(morgan('dev'));
// middleware pour parser le JSON du body des requêtes #elyas
app.use(express.json());

// route de santé — vérifie que le serveur tourne #elyas
app.get('/', (req, res) => {
  res.json({ message: 'Challenge Arena API', version: '1.0' });
});

// branchement des routers sur leurs préfixes #elyas
app.use('/participants', participantsRouter);
app.use('/classement', classementRouter);
app.use('/defis', defiRouter);

// 404 pour toute route inconnue #elyas
app.use((req, res) => {
  res.status(404).json({ error: 'Route introuvable' });
});

// error handler global — lit err.status et err.message posés par les services #elyas
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message || 'Erreur interne du serveur' });
});

// démarre le serveur sur le port défini #elyas
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

export default app;
