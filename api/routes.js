import express from 'express';
// chargement des routes
import apiAuthRoutes from './auth/routes.js';
import apiUsersRoutes from './users/routes.js';
import apiContactsRoutes from './contacts/routes.js';

// Gestion des Jwt
import jwtPermissions from 'express-jwt-permissions';
import jwt from '../src/service/service.jwt.js';
import jwtError from '../src/service/middleware.errorJwt.js';

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
router.use('*', jwtError);

// Si une route n'existe pas, erreur 404
router.route("*").all((req,res) => { res.status(404).send(); });

export default router;