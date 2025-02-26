const router = require("express").Router();
const encryptedStore = require("../models/encrypted-store");
const signupDetails = require("../models/signup");
const {PythonShell} = require("python-shell");


router.post("/decrypt-key", async (req, res) => {
    let {receiverId} = req.body;

    try {
        let Details = await encryptedStore.find({receiverId : receiverId});
        let privateKey = await signupDetails.findById(receiverId, {privateKey : 1, _id : 0});

        const encryptedKey = Details[0].key;
        const privateKeyBase64 = privateKey.privateKey;

        let options = {
            pythonPath: '/usr/bin/python3',
            scriptPath : './controllers',
            args: [encryptedKey, privateKeyBase64],
            pythonOptions: ['-u'],
        };

        const results = await PythonShell.run('decrypt-key.py', options);
        
        const decryptedAesKeyBase64 = results[0];

        res.status(200).json({decryptedAesKeyBase64});

    } catch (error) {
        res.status(400).json({ error: error });
    }
});
module.exports = router;



