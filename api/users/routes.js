import service from './users.js';
import express from 'express';

import jwt from '../jwt.js';
import jwtPermissions from 'express-jwt-permissions';

const guard = jwtPermissions({ requestProperty: 'identity'});
const router = express.Router();

// Récupére tous les utilisateurs
router.get('/', jwt.control, guard.check('ADMIN', 'ESTATE_AGENT'), service.get);

// Récupére 1 utilisateur via son ID
router.get('/:id', jwt.control, guard.check('ADMIN', 'ESTATE_AGENT'), service.getById);

// Création d'un utilisateur
router.post('/', jwt.control, guard.check('ADMIN', 'ESTATE_AGENT'), service.add);

// Modification d'un utilisateur via son ID
router.put('/:id', jwt.control, guard.check('ADMIN', 'ESTATE_AGENT'), service.update);

// Suppression d'un utilisateur via son ID
router.delete('/:id', jwt.control, guard.check('ADMIN'), service.delete);

// Les autres méthodes sont donc non allouées
router.route('/').all((req,res) => { res.status(405).send(); });
router.route('/:id').all((req,res) => { res.status(405).send(); });

export default router;