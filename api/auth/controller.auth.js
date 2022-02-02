import uuidAPIKey from 'uuid-apikey';
import jwt from 'jsonwebtoken';
import Repo from '../../src/repository/repository.users.js';

const UserRepo = new Repo();

class Auth {
    /**
     * @api {get} /auth Request Authorization ApiKey
     * @apiVersion 1.0.0
     * @apiName GetJWTToken via APIkEY
     * @apiGroup Auth
     *
     * @apiHeader {String} authorization x-api-key <API_KEY>.
     * @apiHeaderExample {json} Header-Example:
     *     {
     *       "x-api-key": "1EEA6DC-JAM4DP2-PHVYPBN-V0XCJ9X"
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
        if (typeof req.headers['x-api-key'] == 'undefined' || uuidAPIKey.isAPIKey(req.headers['x-api-key']) !== true ) {
            return res.status(400).json({error : `La demande n'est pas valide.`});
        }
        
        // Si la clef est valide, on peut continuer
        UserRepo.findByApiKey(req.headers['x-api-key'], 'firstname lastname email roles').then((record)=> {
            const payload = {
                id : record._id,
                firstname : record.firstname,
                lastname : record.lastname, 
                email : record.email, 
                permissions: record.roles
            };
            // Générer un JWT
            return res.status(200).json({ token : jwt.sign(payload, process.env.JWT_SECRET_KEY) });
        }).catch((error) => {
            return res.status(404).json({error});
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
        if (typeof req.headers.authorization === 'undefined' || 
            (typeof req.headers.authorization !== 'undefined' && req.headers.authorization.split(' ')[0] !== 'Basic')
            ) {
            // ... on peut directement aller au prochain middleware
            next();
            return;
        }
       
        const base64Credentials =  req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [email, password] = credentials.split(':');

        UserRepo.findByEmailAndPassword(email, password).then((record)=> {
            // On enregistre la clef API dans la requête
            req.headers['x-api-key'] = record.apiKey;
            next();
        }).catch((error) => {
            res.status(401).json({error : `L'authentification a échoué.`});
        });
    }
}

export default new Auth();