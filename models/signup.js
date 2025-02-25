const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    privateKey: { type: String, required: true },
    publicKey: { type: String, required: true },

    data : {
        key : {type : String},
        indices: {type : [[Number]]},
        encryptedText : {type : String},
        receiverId : {type : String},
    }

});

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }

    const { privateKey, publicKey } = generateECCKeyPair();
    this.privateKey = privateKey;
    this.publicKey = publicKey;

    next();
});


userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


function generateECCKeyPair() {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
        namedCurve: 'secp256k1', 
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        },
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        }
    });
    return { privateKey, publicKey };
}


const User = model('User', userSchema);

module.exports = User;
