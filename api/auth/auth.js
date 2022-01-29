import Schema from '../users/schema.js';
import uuidAPIKey from 'uuid-apikey';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

class Auth {
    /**
     * @api {get} /auth Request Authorization ApiKey
     * @apiVersion 1.0.0
     * @apiName GetJWTToken via APIkEY
     * @apiGroup Auth
     *
     * @apiHeader {String} authorization apikey <API_KEY>.
     * @apiHeaderExample {json} Header-Example:
     *     {
     *       "apikey": "1EEA6DC-JAM4DP2-PHVYPBN-V0XCJ9X"
     *     }
     * 
     * @apiError {String} Invalide API Key.
     * @apiErrorExample {json} Error-Response:
     *     HTTP/1.1 400 OK
     *     {
     *       "error": "La demande n'est pas valide."
     *     }
     * @apiError {String} Not Exists API Key.
     * @apiErrorExample {json} Error-Response:
     *     HTTP/1.1 404 OK
     *     {
     *       "error": "La clé API n'existe pas."
     *     }
     * 
     * @apiSuccess {String} JWT.
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZjI3NmU2NmU1ODE5ZWM5YzZiZDRhMCIsImZpcnN0bmFtZSI6IkN5cmlsIiwibGFzdG5hbWUiOiJMRUNPTVRFIiwiZW1haWwiOiJjeXJoYWRlczc2QGdtYWlsLmNvbSIsInJvbGVzIjpbIlVTRVIiXSwiaWF0IjoxNjQzMzc3MDQ0fQ.4bpgJxL2mKMafFj6bciMaGxoDSg5K-lA2va_pTKmmQM"
     *     }
     */
    getAuthByApiKey(req, res) {
        // Validation de la clef API, ApiKey : 1EEA6DC-JAM4DP2-PHVYPBN-V0XCJ9X
        if (uuidAPIKey.isAPIKey(req.headers.apikey) !== true ) {
            return res.status(400).json({error : `La demande n'est pas valide.`});
        }

        // Si la clef est valide, on peut continuer
        Schema.findOne({apiKey : req.headers.apikey}, 'firstname lastname email roles').exec((err, record) => {
            if (!err) {    
                if (record) {
                    const payload = {
                        id : record._id,
                        firstname : record.firstname,
                        lastname : record.lastname, 
                        email : record.email, 
                        roles : record.roles
                    };
                    // Générer un JWT
                    let token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
                    if(record) return res.status(200).json({ token });
                }
                else return res.status(404).json({error : `La clé API n'existe pas.`});
            }
            else {
                // On devrait plus arriver ici car le control de l'ObjectID la gere directement
                return res.status(400).json({error : `La demande n'est pas valide.`});
            }
        });
    }

    /**
     * @api {get} /auth Request Authorization Basic
     * @apiVersion 1.0.0
     * @apiName GetJWTToken via Authorization Basic
     * @apiGroup Auth
     *
     * @apiHeader {String:base64} authorization basiv <login:password>.
     * @apiHeaderExample {json} Header-Example:
     *     {
     *       "basic": "bS5kdXBvbnRAeW9wbWFpbC5jb206cGFzc3dvcmQ="
     *     }
     * 
     * @apiErrorExample {json} Error-Response:
     *     HTTP/1.1 401 OK
     *     {
     *       "error": "L'authentification a échoué."
     *     }
     * 
     * @apiSuccess {String} JWT.
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZjI3NmU2NmU1ODE5ZWM5YzZiZDRhMCIsImZpcnN0bmFtZSI6IkN5cmlsIiwibGFzdG5hbWUiOiJMRUNPTVRFIiwiZW1haWwiOiJjeXJoYWRlczc2QGdtYWlsLmNvbSIsInJvbGVzIjpbIlVTRVIiXSwiaWF0IjoxNjQzMzc3MDQ0fQ.4bpgJxL2mKMafFj6bciMaGxoDSg5K-lA2va_pTKmmQM"
     *     }
     */
    basicAuthToAPiKey(req, res, next) {
        
        // Si on n'est pas en basic authentification ...
        if (typeof req.headers.authorization == 'undeifned' || req.headers.authorization.split(' ')[0] !== 'Basic') {
            // ... on peut directement aller au prochaine middleware
            next();
            return;
        }
        const base64Credentials =  req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [login, password] = credentials.split(':');
        // on récupére le mot de passe et le password        
        Schema.findOne({login}, 'apiKey password').exec((err, record) => {
            if (err || !record) { 
                return res.status(401).json({error : `L'authentification a échoué.`});
            }
            else {
                // On vérifie le password
                bcrypt.compare(password, record.password).then((result) =>{
                    if(result === true) {
                        // On enregistre la clef API dans la requête
                        req.headers.apikey = record.apiKey;
                        next();
                        return;
                    } else res.status(401).json({error : `L'authentification a échoué.`});
                });
                    
            }
        });
    }
}

export default new Auth();