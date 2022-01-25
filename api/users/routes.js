let User = require('./users.js');
module.exports = (app) => {
    // Récupére tous les utilisateurs
    app.get('/users', (req, res) => {
        res.status(200).json([]/* Récupération des utisateurs en BDD */);
    });
    // Récupére 1 utilisateur via son ID
    app.get('/users/:id', (req, res) => {
        res.status(200).json({}/* Récupération de l'utisateur en BDD */);
    });
    // Création d'un utilisateur
    app.post('/users', (new User).add);

    // Modification d'un utilisateur via son ID
    app.put('/users/:id', (req, res) => {
        res.status(200).json({});
    });
    // Suppression d'un utilisateur via son ID
    app.delete('/users/:id', (req, res) => {
        res.status(200).json({});
    });

    // Les autres méthodes sont donc non allouées
    app.route('/users').all((req,res) => { res.status(405).send(); });
    app.route('/users/:id').all((req,res) => { res.status(405).send(); });
};