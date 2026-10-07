import * as service from '../Services/classementServices.js';

export function getClassement(req, res) {
  try {
    const classement = service.getClassement();
    res.json(classement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
