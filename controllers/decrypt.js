const CryptoJS = require("crypto-js");

function decrypt(cipherText, secret) {
    var key = CryptoJS.enc.Utf8.parse(secret);
    let iv = CryptoJS.lib.WordArray.create(key.words.slice(0, 4));
    var cipherBytes = CryptoJS.enc.Base64.parse(cipherText);

    var decrypted = CryptoJS.AES.decrypt({ ciphertext: cipherBytes }, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    // Attempt to convert decrypted result to UTF-8, or return raw binary if failed
    let decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

    // Check if the decrypted text is valid
    if (!decryptedText) {
        // Return the result as raw binary if it could not be converted to UTF-8
        return decrypted.toString(CryptoJS.enc.Base64);  // Or you can return it in hex
    }

    return decryptedText;
}

module.exports = { decrypt };
