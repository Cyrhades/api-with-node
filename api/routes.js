import express from 'express';
import apiAuthRoutes from './auth/routes.js';
import apiUsersRoutes from './users/routes.js';

const router = express.Router();

// Création de la route pour l'authentification
router.use('/auth', apiAuthRoutes);

// Chargement des routes pour la collection users
router.use('/users', apiUsersRoutes);

// ... chargement de vos routes ici


// Si une route n'existe pas, erreur 404
router.route("*").all((req,res) => { res.status(404).send(); });

export default router;