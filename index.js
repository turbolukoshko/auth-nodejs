const express = require('express');
const mongoose = require('mongoose');
const router = require('./router.js');

const app = express();
const PORT = process.env.PORT || 5000;
const BD_URL = `mongodb+srv://turbo:turbo@cluster0.g8vej.mongodb.net/auth-nodejs?retryWrites=true&w=majority`;

app.use(express.json());
app.use('/auth', router);

const start = async () => {
  try {
    await mongoose.connect(BD_URL);
    app.listen(PORT, () => {
      console.log(`Server started on port: ${PORT}`)
    });
  } catch(e) {
    console.log(e);
  }
}

start();
