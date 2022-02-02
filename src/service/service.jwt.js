import jwt from 'jsonwebtoken';

class Jwt {
    control(req, res, next) {
        // Validation du JWT
        if (req.headers.authorization) {
            // On récupère le JWT dans le header
            const tokenJwt = req.headers.authorization.split(' ')[1] || null;
            if(tokenJwt) {
                try{
                    jwt.verify(tokenJwt, process.env.JWT_SECRET_KEY, (err, dataJwt) => { 
                        // Erreur du JWT (n'est pas un JWT, a été modifié, est expiré)
                        if(err) return res.status(401).json({error : `Le JWT n'est pas valide.`});
                        req.identity = dataJwt;
                        next();
                        return;
                    });
                } catch(error) {
                    return res.status(401).json({error : `Le JWT n'est pas valide.`});
                }
            } else {
                return res.status(401).json({error : `Le JWT n'est pas valide.`});
            }
        } else {
            return res.status(401).json({error : `Le JWT n'est pas valide.`});
        }
    }
}

export default new Jwt();