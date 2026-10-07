import * as service from '../Services/participantsServices.js';

export function creerParticipant(req, res) {
  try {
    const participant = service.creerParticipant(req.body.nom);
    res.status(201).json(participant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export function listerParticipants(req, res) {
  try {
    const participants = service.listerParticipants();
    res.json(participants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
