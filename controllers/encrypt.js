const CryptoJS = require("crypto-js");
require('dotenv').config();

function encryptText(plaintext, secret) {
    var key = CryptoJS.enc.Utf8.parse(secret);
    let iv = CryptoJS.lib.WordArray.create(key.words.slice(0, 4));
  
    var cipherText = CryptoJS.AES.encrypt(plaintext, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
      });
  return cipherText.toString();
  }


  module.exports = {encryptText};