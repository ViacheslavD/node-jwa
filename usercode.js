const jwa = require('node-jwa');
const ecdsa = jwa('RS256');

module.exports = (data) => {
    var signature = ecdsa.sign(data.unsignedToken, data.private_key);
data.jwt_encoded = data.unsignedToken + "." + signature;
    
    return data;
};
