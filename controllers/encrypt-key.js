const crypto = require('crypto');

function encryptKey(data, publicKey) {
    // Decode the base64-encoded public key
    let decodedKey = Buffer.from(publicKey, 'base64');

    // Construct the PEM format by wrapping the decoded key
    const publicKeyPem = `-----BEGIN PUBLIC KEY-----\n${decodedKey.toString('base64')}\n-----END PUBLIC KEY-----`;

    // Validate the PEM format
    if (!publicKeyPem.includes('-----BEGIN PUBLIC KEY-----')) {
        throw new Error('Invalid public key format');
    }

    try {
        // Encrypt the data using the public key in PEM format
        const bufferData = Buffer.from(data, 'utf-8');

        const encryptedData = crypto.publicEncrypt(
            {
                key: publicKeyPem,  // PEM formatted public key
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            },
            bufferData
        );

        return encryptedData.toString('base64');  // Return the encrypted data in base64
    } catch (err) {
        console.error('Error during encryption:', err);
        throw err;
    }
}

module.exports = {encryptKey};
