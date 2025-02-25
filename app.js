const express = require('express');
const mongoose = require("mongoose");

const encryptionComponent = require("./routes/encryption");
const decryptionComponent = require("./routes/decryption");
const loginComponent = require("./routes/signup-login");
const sendComponent = require("./routes/send-message");


require('dotenv').config();
const app = express();

app.use(express.json());

mongoose.connect("mongodb://localhost:27017/")
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));


app.use("/auth", loginComponent);
app.use("/encrypt", encryptionComponent);
app.use("/decrypt", decryptionComponent);
app.use("/send", sendComponent);

const port = process.env.PORT||3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
