module.exports = (app) => {

    // Chargement des routes pour la collection users
    require('./users/routes')(app);

    // ... chargement de vos routes ici


    // Si une routes n'existe pas erreur 404
    app.route("*").all((req,res) => { res.status(404).send(); });
};