const express = require("express");
const router = express.Router();
const encryptedStore = require("../models/encrypted-store")
const axios = require("axios");
const {decrypt} = require("../controllers/decrypt");

router.post("/decrypt-text", async (req, res) => {
    let { senderId, receiverId } = req.body;

    try {
        let Details = await encryptedStore.find({ senderId: senderId, "receivers.receiverId": receiverId });
        
        if (Details.length === 0) {
            return res.status(404).json({ error: 'Encrypted message not found for these users' });
        }

        let encryptedText = Details[0].encryptedText;
        let newIndex = Details[0].indices;

        let decryptedKey = await axios.post('http://localhost:3000/d-key/decrypt-key', {
            senderId: senderId,
            receiverId: receiverId
        });

        let key = decryptedKey.data.decryptedAesKeyBase64;
        let modifiedText = encryptedText;
        let indexShift = 0;
        for (let i = 0; i < newIndex.length; i++) {
            let [start_index, end_index] = newIndex[i];

            start_index += indexShift;
            end_index += indexShift;

            let cipherText = modifiedText.slice(start_index, end_index);

            let plainText = decrypt(cipherText, key);

            if (!plainText) {
                return res.status(500).json({ error: 'Decryption failed for part of the message' });
            }
            modifiedText = modifiedText.slice(0, start_index) + plainText + modifiedText.slice(end_index);

            indexShift += plainText.length - cipherText.length;
        }
        res.json({ text: modifiedText });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during decryption' });
    }
});




module.exports = router;

