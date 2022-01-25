let User = require('./users.js');
module.exports = (app) => {
    // Récupére tous les utilisateurs
    app.get('/users', (new User).get);
    // Récupére 1 utilisateur via son ID
    app.get('/users/:id', (new User).getById);
    
    // Création d'un utilisateur
    app.post('/users', (new User).add);

    // Modification d'un utilisateur via son ID
    app.put('/users/:id', (new User).update);
    
    // Suppression d'un utilisateur via son ID
    app.delete('/users/:id', (new User).delete);

    // Les autres méthodes sont donc non allouées
    app.route('/users').all((req,res) => { res.status(405).send(); });
    app.route('/users/:id').all((req,res) => { res.status(405).send(); });
};