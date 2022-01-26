let User = require('./users.js');

const express = require('express');
const router = express.Router();

// Récupére tous les utilisateurs
router.get('/', (new User).get);
// Récupére 1 utilisateur via son ID
router.get('/:id', (new User).getById);

// Création d'un utilisateur
router.post('/', (new User).add);

// Modification d'un utilisateur via son ID
router.put('/:id', (new User).update);

// Suppression d'un utilisateur via son ID
router.delete('/:id', (new User).delete);

// Les autres méthodes sont donc non allouées
router.route('/').all((req,res) => { res.status(405).send(); });
router.route('/:id').all((req,res) => { res.status(405).send(); });

module.exports = router;