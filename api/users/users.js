const Schema = require('./schema.js');
const uuidAPIKey = require('uuid-apikey');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports = class {

    get(req, res) {
        let filter = {};
        // @todo : gérer les filtres
        Schema.find(filter).exec((err, records) => {
            if (!err) return res.status(200).json(records);
            else {
                return res.status(400).json({error : `Une erreur est survenue.`});
            }
        });
    }

    getById(req, res) {
        // Validation de l'id
        if (ObjectID.isValid(req.params.id) !== true ) {
            return res.status(400).json({error : `La demande n'est pas valide.`});
        }

        Schema.findById(req.params.id).exec((err, record) => {
            if (!err) {
                if(record) return res.status(200).json(record);
                else return res.status(404).json({error : `L'utilisateur n'existe pas.`});
                
            }
            else {
                // On devrait plus arriver ici car le control de l'ObjectID la gere directement
                return res.status(400).json({error : `La demande n'est pas valide.`});
            }
        });
    }

    add(req, res) {
        let bcrypt = require('bcryptjs');
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
                if(!err) {
                    const newRecord = new Schema({
                        lastname: req.body.lastname,
                        firstname: req.body.firstname,
                        email: req.body.email,
                        password: hash,
                        apiKey: uuidAPIKey.create().apiKey,
                    });
                    newRecord.save((error, record) => {
                        if(!error) return res.status(201).json(record);
                        else if(error.code == 11000){
                            return res.status(400).json({error : `Déjà existant`});
                        } else {
                            return res.status(400).json({error : `L'enregistrement a échoué.`});
                        }
                    });
                } else {
                    return res.status(400).json({error : `L'enregistrement a échoué.`});
                }
            });
        });
    }

    update(req, res) {
        // Validation de l'id
        if (ObjectID.isValid(req.params.id) !== true ) {
            return res.status(400).json({error : `La demande n'est pas valide.`});
        }        
        Schema.findById(req.params.id).exec((err, record) => {
            if (!err) {
                if(record) {
                    
                    // On ne permet pas la modification du mot de passe et ou de l'apiKey
                    // avec cette API, il faut un niveau d'information complémentaire
                    const updateRecord = {
                        lastname: req.body.lastname || record.lastname,
                        firstname: req.body.firstname || record.firstname,
                        email: req.body.email || record.email
                    };
                    Schema.findByIdAndUpdate(req.params.id, { $set: updateRecord}, (err) => {
                        if (!err) return res.status(201).json(record);
                        else {
                            return res.status(400).json({error : `La modification a échoué.`});
                        }
                    });
                }
                else return res.status(404).json({error : `L'utilisateur n'existe pas.`});
            }
            else return res.status(400).json({error : `Une erreur est survenue.`});
        });
    }

    delete(req, res) {
        // Validation de l'id
        if (ObjectID.isValid(req.params.id) !== true ) {
            return res.status(400).json({error : `La demande n'est pas valide.`});
        }
        Schema.deleteOne({id : req.params.id}, (err) => {
            if (!err) return res.status(200).send();
            else {
                return res.status(400).json({error : `La suppression a échoué.`});
            }
        });
    }
};