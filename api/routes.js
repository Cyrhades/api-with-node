import express from 'express';
import apiAuthRoutes from './auth/routes.js';
import apiUsersRoutes from './users/routes.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Création de la route pour l'authentification
router.use('/auth', apiAuthRoutes);

// A partir d'ici on peut controler que le JWT est valide pour l'ensemble des routes
router.use((req, res, next) => {
    // Validation du JWT
    if (req.headers.authorization) {
        // On récupère le JWT dans le header
        const token = req.headers.authorization.split(' ')[1] || null;
        if(token) {
            try{
                if(jwt.verify(token, process.env.JWT_SECRET_KEY)) {
                    next();
                    return;
                }
            } catch(error) {
                next();
                return;
            }
        }
    }
});

// Chargement des routes pour la collection users
router.use('/users', apiUsersRoutes);

// ... chargement de vos routes ici


// Si une route n'existe pas, erreur 404
router.route("*").all((req,res) => { res.status(404).send(); });

export default router;