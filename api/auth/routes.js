import service from './auth.js';
import express from 'express';

const router = express.Router();

// Récupére tous les utilisateurs
router.get('/', service.getAuthByApiKey);


// Les autres méthodes sont donc non allouées
router.route('/').all((req,res) => { res.status(405).send(); });
router.route('/:id').all((req,res) => { res.status(405).send(); });

export default router;