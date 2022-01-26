if(typeof process.env.PORT == 'undefined') {
    module.exports = require('./config.dev.js');
} else {
    module.exports = {
        port : process.env.PORT || 80,
        mongodb_uri : process.env.MONGODB_URI,
    };
}