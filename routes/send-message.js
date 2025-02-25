const router = require("express").Router();
const crypto = require("crypto");
const encryptedStore = require("../models/encrypted-store");
const signupDetails = require("../models/signup");


router.post("/send-message", async (req, res)=>{
    let {senderId, receiverId} = req.body;

    try{
        let receiverPublicKey = await signupDetails.findById(receiverId, {publicKey : 1})
        res.status(200).json({message : receiverPublicKey});

    }catch(error){
        res.status(400).json({error : error});
    }

})
module.exports = router;



