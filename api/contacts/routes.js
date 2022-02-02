import controller from './controller.contacts.js';
import express from 'express';

const router = express.Router();

// Récupére tous les utilisateurs
router.get('/', controller.get);
// Récupére 1 utilisateur via son ID
router.get('/:id', controller.getById);

// Création d'un utilisateur
router.post('/', controller.add);

// Modification d'un utilisateur via son ID
router.put('/:id', controller.update);

// Suppression d'un utilisateur via son ID
router.delete('/:id', controller.delete);

// Les autres méthodes sont donc non allouées
router.route('/').all((req,res) => { res.status(405).send(); });
router.route('/:id').all((req,res) => { res.status(405).send(); });

export default router;