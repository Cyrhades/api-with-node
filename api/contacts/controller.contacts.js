import mongoose from 'mongoose';

import Repo from '../../src/repository/repository.contacts.js';
import data from '../../src/service/service.dataApiResponse.js';

const ContactRepo = new Repo();
const ObjectID = mongoose.Types.ObjectId;

class Contact {

    get(req, res) {
        let page = parseInt(req.query.page) || 1;
        let limit = 10; // nombre d'éléments par page
        let offset = (limit*page)-limit;
        
        // @todo : gérer les filtres
        let filter = {};
        ContactRepo.count(filter).then((count) => {
            ContactRepo.getAll(filter, 'civility firstname lastname phone email info date', { limit: limit, skip: offset }).then((records) => {
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
        ContactRepo.findById(req.params.id, 'civility firstname lastname phone email info date').then((record) => {
            return res.status(200).json(record);
        }).catch((error) => {
            return res.status(400).json({error});
        });
    }

    add(req, res) {
        ContactRepo.insert({
            civility: req.body.civility||null, 
            lastname: req.body.lastname||null, 
            firstname: req.body.firstname||null,
            phone: req.body.phone||null, 
            email: req.body.email||null,
            info: req.body.info||null, 
        }).then((record) => {
            return res.status(201).json(record)
        }).catch((error) => {
            if(error.code == 11000){
                return res.status(400).json({error : `Le contact existe déjà.`});
            } else {
                return res.status(400).json({error : `L'enregistrement de le contact a échoué.`});
            }
        });
    }

    update(req, res) {
        // Validation de l'id
        if (ObjectID.isValid(req.params.id) !== true ) {
            return res.status(400).json({error : `La demande n'est pas valide.`});
        } 
        ContactRepo.update(
            req.params.id, 
            {
                civility: req.body.civility||null, 
                lastname: req.body.lastname||null, 
                firstname: req.body.firstname||null,
                phone: req.body.phone||null, 
                email: req.body.email||null,
                info: req.body.info||null, 
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
        
        ContactRepo.delete(req.params.id).then((message) => {
            return res.status(200).send();
        }).catch((error) => {
            return res.status(400).json({error});
        });
    }
}

export default new Contact();