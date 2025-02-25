function decryptKey(privateKey, encryptedData){
    const bufferData = Buffer.from(encryptedData, 'base64');
    const decryptedData = crypto.privateDecrypt(
        {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256',
        },
        bufferData
    );
    return decryptedData.toString('utf8');
}

module.exports = decryptKey;