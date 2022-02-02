import AbstractRepository from './abastract.repository.js';
import Schema from './schema/users.js';
import bcrypt from 'bcryptjs';

export default class extends AbstractRepository {
    
    constructor() {
        super(Schema, {
            "not_exists": `L'utilisateur n'existe pas.`,
            "insert": `La création de l'utilisateur a échoué.`,
            "update": `La modification de l'utilisateur a échoué.`,
            "delete": `L'utilisateur a été supprimé.`,
            "invbalid": `La demande n'est pas valide.`
        });        
    }

    findByApiKey(apiKey, projection = null) {
        return new Promise((resolve, reject) => {
            this.Schema.findOne({apiKey}, projection).exec((err, record) => {
                if (!err) {    
                    if (record) {
                        resolve(record);
                    }
                    else reject( `La clé API n'existe pas.`);
                }
                else {
                    reject(this.messages.invalid);
                }
            });
        });
    }

    findByEmailAndPassword(email, password) {
        return new Promise((resolve, reject) => {
            // on récupére le mot de passe et le password        
            this.Schema.findOne({email}).exec((err, record) => {
                if (err || !record) { 
                    reject(`L'authentification a échoué.`);
                }
                else {
                    // On vérifie le password
                    bcrypt.compare(password, record.password).then((result) =>{
                        if(result === true) resolve(record);
                        else reject(`L'authentification a échoué.`);
                    });
                }
            });
        });
    }
}