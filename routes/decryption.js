const express = require("express");
const router = express.Router();

const {decrypt} = require("../controllers/decrypt");

router.post("/decrypt-text", async (req, res) => {
    let {encryptedText, newIndex } = req.body;

    try {
        let modifiedText = encryptedText;
        let indexShift = 0;

        for (let i = 0; i < newIndex.length; i++) {
            let [start_index, end_index] = newIndex[i];

            start_index += indexShift;
            end_index += indexShift;

            let cipherText = modifiedText.slice(start_index, end_index);

            let plainText = decrypt(cipherText);
            console.log(plainText);

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

// John Doe, born on 12th March 1990, resides at 1234 Elm Street, Springfield, IL, with his wife, Jane Doe, and their two children. His phone number is (555) 123-4567, and his email address is john.doe@email.com. He works as a software engineer at TechCorp, where his employee ID is 789456. John’s bank account number is 9876543210, and he holds an account with Springfield National Bank. His social security number is 123-45-6789.