const router = require("express").Router();
const encryptedStore = require("../models/encrypted-store");
const signupDetails = require("../models/signup");
const {PythonShell} = require("python-shell");


router.post("/encrypt-key", async (req, res) => {
    let { senderId, receiverId } = req.body;

    try {
        let aesData = await signupDetails.findById(senderId, {data : 1 , _id : 0});
        let publicKey = await signupDetails.findById(receiverId, {publicKey : 1, _id : 0});

        const aesKeyBase64 = aesData.data[0].key;
        const publicKeyBase64 = publicKey.publicKey;

        let options = {
            pythonPath: '/usr/bin/python3',
            scriptPath : './controllers',
            args: [aesKeyBase64, publicKeyBase64],
            pythonOptions: ['-u'],
        };

        const results = await PythonShell.run('encrypt-key.py', options);
        
        const encryptedAesKeyBase64 = results[0];

        const encryptedDbFormat = {
            encryptedText: aesData.data[0].encryptedText,
            key: encryptedAesKeyBase64,
            indices: aesData.data[0].indices,
            receiverId: aesData.data[0].receiverId,
            createdAt: Date.now(),
        };
        
        const result = await encryptedStore.findOneAndUpdate(
            { receiverId: aesData.data[0].receiverId },
            encryptedDbFormat,
            { upsert: true, new: true }
        );

        res.status(200).json({ aesData, encryptedAesKey: encryptedAesKeyBase64 });

    } catch (error) {
        res.status(400).json({ error: error });
    }
});
module.exports = router;



