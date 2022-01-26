import Entity from './users.js';
import express from 'express';

const router = express.Router();

// Récupére tous les utilisateurs
router.get('/', Entity.get);
// Récupére 1 utilisateur via son ID
router.get('/:id', Entity.getById);

// Création d'un utilisateur
router.post('/', Entity.add);

// Modification d'un utilisateur via son ID
router.put('/:id', Entity.update);

// Suppression d'un utilisateur via son ID
router.delete('/:id', Entity.delete);

// Les autres méthodes sont donc non allouées
router.route('/').all((req,res) => { res.status(405).send(); });
router.route('/:id').all((req,res) => { res.status(405).send(); });

export default router;