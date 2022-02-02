export default (err, req, res, next) => {
    if((err.code === 'permission_denied')) {
        res.status(403).json({error : `Vous n'avez pas les droits pour accéder à cette ressource.`});
    }
    next(); // on poursuit vers le middleware suivant (erreur 404)
};