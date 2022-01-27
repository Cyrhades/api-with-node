import Schema from '../users/schema.js';
import uuidAPIKey from 'uuid-apikey';
import jwt from 'jsonwebtoken';

class Auth {

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