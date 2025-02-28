const router = require("express").Router();
const encryptedStore = require("../models/encrypted-store");
const signupDetails = require("../models/signup");
const {PythonShell} = require("python-shell");

router.post("/encrypt-key", async (req, res) => {
    let { senderId, receiverIds } = req.body;

    try {
        let senderData = await signupDetails.findById(senderId, { data: 1, _id: 0 });
        if (!senderData || senderData.data.length === 0) {
            return res.status(404).json({ error: "Sender data not found" });
        }

        let aesKeyBase64 = senderData.data[0].key;
        let encryptedText = senderData.data[0].encryptedText;
        let indices = senderData.data[0].indices;

        let receivers = await signupDetails.find(
            { _id: { $in: receiverIds } }, 
            { _id: 1, publicKey: 1 }
        );

        if (receivers.length === 0) {
            return res.status(404).json({ error: "No valid receivers found" });
        }

        let encryptedReceivers = [];

        for (let receiver of receivers) {
            let options = {
                pythonPath: "/usr/bin/python3",
                scriptPath: "./controllers",
                args: [aesKeyBase64, receiver.publicKey],
                pythonOptions: ["-u"],
            };

            const results = await PythonShell.run("encrypt-key.py", options);
            const encryptedAesKeyBase64 = results[0];

            encryptedReceivers.push({
                receiverId: receiver._id,
                key: encryptedAesKeyBase64,
            });
        }

        const encryptedMessage = new encryptedStore({
            senderId,
            indices,
            encryptedText,
            receivers: encryptedReceivers,
            createdAt: Date.now(),
        });

        await encryptedMessage.save();

        res.status(200).json({ message: "Encryption successful", encryptedMessage });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});


module.exports = router;



