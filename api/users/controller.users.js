import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import uuidAPIKey from 'uuid-apikey';

import Repo from '../../src/repository/repository.users.js';
import data from '../../src/service/service.dataApiResponse.js';

const UserRepo = new Repo();
const ObjectID = mongoose.Types.ObjectId;

class User {

    get(req, res) {
        let page = parseInt(req.query.page) || 1;
        let limit = 10; // nombre d'éléments par page
        let offset = (limit*page)-limit;
        
        // @todo : gérer les filtres
        let filter = {};
        UserRepo.count(filter).then((count) => {
            UserRepo.getAll(filter, 'firstname lastname email roles date', { limit: limit, skip: offset }).then((records) => {
                return res.status(200).json(data(records, page, count, limit));  
            }).catch((error) => {
                return res.status(400).json({error});
            });
        }).catch((error) => {
            return res.status(400).json({error});
        });
    }

    getById(req, res) {
        // Validation de l'id
        if (ObjectID.isValid(req.params.id) !== true ) {
            return res.status(400).json({error : `La demande n'est pas valide.`});
        }
        UserRepo.findById(req.params.id, 'firstname lastname email roles date').then((record) => {
            return res.status(200).json(record);
        }).catch((error) => {
            return res.status(400).json({error});
        });
    }

    add(req, res) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
                if(!err) {
                    UserRepo.insert({
                       lastname: req.body.lastname,
                       firstname: req.body.firstname, 
                       email: req.body.email, 
                       password: hash,
                       apiKey: uuidAPIKey.create().apiKey
                    }).then((record) => {
                        return res.status(201).json(record)
                    }).catch((error) => {
                        if(error.code == 11000){
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
        UserRepo.update(
            req.params.id, 
            {
                lastname: req.body.lastname||null, 
                firstname: req.body.firstname||null,
                email: req.body.email||null
            }
        ).then((record) => {
            return res.status(201).json(record)
        }).catch((error) => {
            return res.status(400).json({error});
        });
    }

    delete(req, res) {
        // Validation de l'id
        if (ObjectID.isValid(req.params.id) !== true ) {
            return res.status(400).json({error : `La demande n'est pas valide.`});
        }
        
        UserRepo.delete(req.params.id).then((message) => {
            return res.status(200).send();
        }).catch((error) => {
            return res.status(400).json({error});
        });
    }
}

export default new User();