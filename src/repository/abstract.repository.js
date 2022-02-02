export default class AbstractRepository
{  
    constructor(schema, messages) {
        this.Schema = schema;
        this.messages = messages;
    }

    findById(id, projection = null) {
        return new Promise((resolve, reject) => {
            this.Schema.findOne({_id:id}, projection).exec((err, record) => {
                if (!err) {    
                    if (record) resolve(record);
                    else reject(this.messages.not_exists || `L'entité n'existe pas.`);
                }
                else {
                    reject(this.messages.invalid);
                }
            });
        });
    }

    count(filter = {}) {
        return new Promise((resolve, reject) => {
            this.Schema.count(filter).then(resolve).catch(reject);
        });
    }

    getAll(filter = {}, projection = null, options = {}) {
        return new Promise((resolve, reject) => {
            this.Schema.find(filter, projection, options).exec((err, records) => {
                if (!err) resolve(records);
                else reject(err);
            });
        });
    }

    insert(record) {
        return new Promise((resolve, reject) => {
            const newRecord = new this.Schema(record);
            newRecord.save((err, records) => {
                if (!err) resolve(records);
                else reject(this.messages.insert || `La création de l'entité a échoué.`);
            });
        });
    }
    
    update(id, record) {
        return new Promise((resolve, reject) => {
            this.Schema.findByIdAndUpdate(id, { $set: record}, (err) => {
                if (!err) resolve(record);
                else reject(this.messages.update || `La modification de l'entité a échoué.`);
            });
        });
    }


    delete(id) {
        return new Promise((resolve, reject) => {
            this.Schema.findByIdAndDelete(id, (err) => {
                if (!err) resolve(this.messages.delete || `L'entité a été supprimé.`);
                else reject(this.messages.not_exists || `L'entité n'existe pas.`);
            });
        });
    }
}