import express from 'express';
import apiAuthRoutes from './auth/routes.js';
import apiUsersRoutes from './users/routes.js';
import apiContactsRoutes from './contacts/routes.js';

import jwt from './jwt.js';
import jwtPermissions from 'express-jwt-permissions'
const guard = jwtPermissions({ requestProperty: 'identity'});

const router = express.Router();

// Création de la route pour l'authentification
router.use('/auth', apiAuthRoutes);

// Chargement des routes pour la collection users
router.use('/users', jwt.control, guard.check('USER', 'ADMIN', 'ESTATE_AGENT'), apiUsersRoutes);

// Chargement des routes pour la collection users
router.use('/contacts', jwt.control, guard.check('USER', 'ADMIN', 'ESTATE_AGENT'), apiContactsRoutes);

// ... chargement de vos routes ici

// Gestion des erreurs de droits (express-jwt-permissions)
router.use('*', (err, req, res, next) => {
    if((err.code === 'permission_denied')) {
        res.status(403).json({error : `Vous n'avez pas les droits pour accéder à cette ressource.`});
    }
    next(); // on poursuis vers le middleware suivant (erreur 404)
});

// Si une route n'existe pas, erreur 404
router.route("*").all((req,res) => { res.status(404).send(); });

export default router;