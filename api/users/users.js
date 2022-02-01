import Schema from './schema.js';
import uuidAPIKey from 'uuid-apikey';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const ObjectID = mongoose.Types.ObjectId;

class User {

    get(req, res) {
        let page = parseInt(req.query.page) || 1;
        let limit = 10; // nombre d'éléments par page
        let offset = (limit*page)-limit;
        
        // @todo : gérer les filtres
        let filter = {};
        Schema.count(filter).then((count) => {
            let last = Math.ceil(count/limit);
            Schema.find(filter, 'firstname lastname email roles date', { limit: limit, skip: offset }).exec((err, records) => {
                if (!err) return res.status(200).json({
                    records, 
                    nbRecords : count,
                    page : {
                        current : page,
                        previous: (page > 1) ? page-1 : null,
                        next: (page < last) ? page+1 : null,
                        last: last
                    }
                });   
                else {
                    return res.status(400).json({error : `Une erreur est survenue.`});
                }
            });
        });
    }

    getById(req, res) {
        // Validation de l'id
        if (ObjectID.isValid(req.params.id) !== true ) {
            return res.status(400).json({error : `La demande n'est pas valide.`});
        }

        Schema.findById(req.params.id, 'firstname lastname email roles date').exec((err, record) => {
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
                            return res.status(400).json({error : `L'utilisateur existe déjà.`});
                        } else {
                            return res.status(400).json({error : `L'enregistrement de l'utilisateur a échoué.`});
                        }
                    });
                } else {
                    return res.status(400).json({error : `L'enregistrement de l'utilisateur a échoué.`});
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
                            return res.status(400).json({error : `La modification de l'utilisateur a échoué.`});
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
                return res.status(400).json({error : `La suppression de l'utilisateur a échoué.`});
            }
        });
    }
}

export default new User();