const express = require('express');
const mongoose = require("mongoose");

const encryptionComponent = require("./routes/encryption");
const decryptionComponent = require("./routes/decryption");


require('dotenv').config();
const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));


app.use("/encrypt", encryptionComponent);
app.use("/decrypt", decryptionComponent);

const port = process.env.PORT||3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
