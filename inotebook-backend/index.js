const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const app = express();
require("dotenv").config();

const port = 5000;

const mongoURI =  process.env.MONGO_URI;

const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/note');

 
app.use(cors());
app.use(express.json());
app.use('/api/auth',authRoutes);
app.use('/api/notes',noteRoutes);
app.get('/',(req,res)=>{
    res.json({message:"Server Index"});
})

mongoose.connect(mongoURI, () => {
    console.log("Connected to DB!");
  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
});
