import AbstractRepository from './abstract.repository.js';
import Schema from './schema/contacts.js';

export default class extends AbstractRepository {
    
    constructor() {
        super(Schema, {
            "not_exists": `Le contact n'existe pas.`,
            "insert": `La création de le contact a échoué.`,
            "update": `La modification de le contact a échoué.`,
            "delete": `Le contact a été supprimé.`,
            "invalid": `La demande n'est pas valide.`
        });        
    }
}