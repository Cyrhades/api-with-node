import Schema from './schema.js';
import mongoose from 'mongoose';

const ObjectID = mongoose.Types.ObjectId;

class Contact {

    get(req, res) {
        let filter = {};
        // @todo : gérer les filtres
        Schema.find(filter, 'civility firstname lastname phone email info date').exec((err, records) => {
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

        Schema.findById(req.params.id, 'civility firstname lastname phone email info date').exec((err, record) => {
            if (!err) {
                if(record) return res.status(200).json(record);
                else return res.status(404).json({error : `Le contact n'existe pas.`});
                
            }
            else {
                // On devrait plus arriver ici car le control de l'ObjectID la gere directement
                return res.status(400).json({error : `La demande n'est pas valide.`});
            }
        });
    }

    add(req, res) {
        const newRecord = new Schema({
            civility: req.body.civility || '',
            lastname: req.body.lastname || '',
            firstname: req.body.firstname || '',
            phone: req.body.phone || '',
            email: req.body.email || '',
            info: req.body.info || '',
        });
        newRecord.save((error, record) => {
            if(!error) return res.status(201).json(record);
            else if(error.code == 11000){
                return res.status(400).json({error : `Le contact existe déjà.`});
            } else {
                return res.status(400).json({error : `L'enregistrement du contact a échoué.`});
            }
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
                    const updateRecord = {
                        civility: req.body.civility || record.civility,
                        lastname: req.body.lastname || record.lastname,
                        firstname: req.body.firstname || record.firstname,
                        email: req.body.phone || record.phone,
                        email: req.body.email || record.email,
                        info: req.body.info || record.info
                    };
                    Schema.findByIdAndUpdate(req.params.id, { $set: updateRecord}, (err) => {
                        if (!err) return res.status(201).json(record);
                        else {
                            return res.status(400).json({error : `La modification du contact a échoué.`});
                        }
                    });
                }
                else return res.status(404).json({error : `Le contact n'existe pas.`});
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
                return res.status(400).json({error : `La suppression du contact a échoué.`});
            }
        });
    }
}

export default new Contact();