const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    privateKey: { type: String, required: true },
    publicKey: { type: String, required: true }
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }

    const { privateKey, publicKey } = generateKeyPair();
    this.privateKey = privateKey;
    this.publicKey = publicKey;

    next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

function generateKeyPair() {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        }
    });
    return { privateKey, publicKey };
}

const User = model('User', userSchema);

module.exports = User;
