const router = require("express").Router();
const crypto = require("crypto");
const encryptedStore = require("../models/encrypted-store");
const signupDetails = require("../models/signup");
const {encryptKey} = require("../controllers/encrypt-key");
const decryptKey = require("../controllers/decrypt-key");


router.post("/send-message", async (req, res)=>{
    let {senderId, receiverId} = req.body;

    try{
        let aesKey = await signupDetails.findById(senderId, {'data.key' : 1, _id : 0})
        let publicKey = await signupDetails.findById(receiverId,{publicKey : 1, _id : 0});

        console.log("key : " + aesKey.data[0].key);
        console.log("publicKey : " + publicKey.publicKey)
        


        res.status(200).json({details : details, message : publicKey});

    }catch(error){
        res.status(400).json({error : error});
    }

})
module.exports = router;



