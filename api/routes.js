import express from 'express';
import apiUsersRoutes from './users/routes.js';
const router = express.Router();


// Chargement des routes pour la collection users
router.use('/users', apiUsersRoutes);

// ... chargement de vos routes ici


// Si une route n'existe pas, erreur 404
router.route("*").all((req,res) => { res.status(404).send(); });

export default router;