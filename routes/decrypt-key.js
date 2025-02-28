const express = require("express");
const { PythonShell } = require("python-shell");
const EncryptedMessage = require("../models/encrypted-store");
const signupDetails = require("../models/signup");
    

const router = express.Router();

router.post("/decrypt-key", async (req, res) => {
    let { senderId, receiverId } = req.body;

    try {
        const encryptedMessage = await EncryptedMessage.findOne({
            "senderId": senderId,
            "receivers.receiverId": receiverId
        }).sort({ createdAt: -1 });

        if (!encryptedMessage) {
            return res.status(404).json({ error: "Message not found for this receiver." });
        }

        const receiver = encryptedMessage.receivers.find(receiver => receiver.receiverId.toString() === receiverId);
        const encryptedKey = receiver.key;

        const receiverDetails = await signupDetails.findById(receiverId, { privateKey: 1, _id: 0 });
        if (!receiverDetails) {
            return res.status(404).json({ error: "Receiver not found." });
        }

        const privateKeyBase64 = receiverDetails.privateKey;

        let options = {
            pythonPath: '/usr/bin/python3',
            scriptPath: './controllers',
            args: [encryptedKey, privateKeyBase64],
            pythonOptions: ['-u'],
        };
        
        const results = await PythonShell.run('decrypt-key.py', options);

        const decryptedAesKeyBase64 = results[0];

        await EncryptedMessage.updateOne(
            { _id: encryptedMessage._id },
            { $pull: { receivers: { receiverId: receiverId } } }
        );

        
        res.status(200).json({decryptedAesKeyBase64});

    } catch (error) {
        console.error("Error decrypting message:", error);
        res.status(400).json({ error: error.message || "Internal server error" });
    }
});


module.exports = router;



