const Schema = require('./schema.js');
const uuidAPIKey = require('uuid-apikey');
module.exports = class {
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
                        }
                    });
                } else {
                    return res.status(400).json({error : `L'enregistrement a échoué 2.`});
                }
            });
        });
        //return res.status(400).json({error : `L'enregistrement a échoué 1.`});
    }
};