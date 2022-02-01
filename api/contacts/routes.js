import service from './contacts.js';
import express from 'express';

const router = express.Router();

// Récupére tous les utilisateurs
router.get('/', service.get);
// Récupére 1 utilisateur via son ID
router.get('/:id', service.getById);

// Création d'un utilisateur
router.post('/', service.add);

// Modification d'un utilisateur via son ID
router.put('/:id', service.update);

// Suppression d'un utilisateur via son ID
router.delete('/:id', service.delete);

// Les autres méthodes sont donc non allouées
router.route('/').all((req,res) => { res.status(405).send(); });
router.route('/:id').all((req,res) => { res.status(405).send(); });

export default router;