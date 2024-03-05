const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;






app.get("/", (req, res) => {
    res.send("Welcome to our Luxe Market Pro")
})
app.listen(port, () => {
    console.log(`Welcome to our Luxe Market Pro ${port}` );
})