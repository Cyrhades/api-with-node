const express = require('express');
const router = express.Router();

// Chargement des routes pour la collection users
router.use('/users', require('./users/routes'));

// ... chargement de vos routes ici


// Si une route n'existe pas, erreur 404
router.route("*").all((req,res) => { res.status(404).send(); });

module.exports = router;