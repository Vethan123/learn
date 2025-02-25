const router = require("express").Router();
const encryptedStore = require("../models/encrypted-store");
const signupDetails = require("../models/signup");
const {PythonShell} = require("python-shell");


router.post("/decrypt-key", async (req, res) => {
    let {receiverId} = req.body;

    try {
        let aesKey = await signupDetails.findById(senderId, {'data.key' : 1, _id : 0});
        let publicKey = await signupDetails.findById(receiverId, {publicKey : 1, _id : 0});

        const aesKeyBase64 = aesKey.data[0].key;
        const publicKeyBase64 = publicKey.publicKey;

        let options = {
            pythonPath: '/usr/bin/python3',
            scriptPath : './controllers',
            args: [aesKeyBase64, publicKeyBase64],
            pythonOptions: ['-u'],
        };

        const results = await PythonShell.run('encrypt-key.py', options);
        
        const encryptedAesKeyBase64 = results[0];

        res.status(200).json({ encryptedAesKey: encryptedAesKeyBase64 });

    } catch (error) {
        res.status(400).json({ error: error });
    }
});
module.exports = router;



