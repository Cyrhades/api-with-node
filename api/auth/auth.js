import Schema from '../users/schema.js';
import uuidAPIKey from 'uuid-apikey';
import jwt from 'jsonwebtoken';

class Auth {
    /**
     * @api {get} /auth/ Request JWTToken
     * @apiName GetJWTToken
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
}

export default new Auth();