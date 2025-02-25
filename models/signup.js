const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    privateKey: { type: String, required: true },
    publicKey: { type: String, required: true },
    data: [{
        key: { type: String },
        indices: { type: [[Number]] },
        encryptedText: { type: String },
        receiverId: { type: String },
    }]
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }

    const { privateKey, publicKey } = generateRSAKeyPair();

    this.privateKey = privateKey.toString('base64');
    this.publicKey = publicKey.toString('base64');

    next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

function generateRSAKeyPair() {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048, 
        publicKeyEncoding: {
            type: 'spki', 
            format: 'pem', 
        },
        privateKeyEncoding: {
            type: 'pkcs8', 
            format: 'pem', 
        },
    });

    const privateKeyBuffer = Buffer.from(privateKey);
    const publicKeyBuffer = Buffer.from(publicKey);

    return { privateKey: privateKeyBuffer, publicKey: publicKeyBuffer };
}

const User = model('User', userSchema);

module.exports = User;
