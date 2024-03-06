const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: [
      
       "https://luxe-market-pro.web.app"
    ],
    
    credentials: true
  }));
  app.use(express.json())
  app.use(cookieParser())

  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.30z9ip6.mongodb.net/?retryWrites=true&w=majority`;
  console.log(uri)
  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    const logger = async (req, res, next) => {
        console.log('called:', req.host, req.originalUrl)
        next();
      }
      
      const verifyToken = async (req, res, next) => {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).send({ message: 'unauthorized access' })
        }
        jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
            if (err) {
                return res.status(401).send({ message: 'unauthorized access' })
            }
            req.user = decoded;
            next();
        })
      }


    async function run() {
        try {
          // Connect the client to the server	(optional starting in v4.7)
          // await client.connect();
          // Send a ping to confirm a successful connection
          
          // await client.db("admin").command({ ping: 1 });
          // console.log("Pinged your deployment. You successfully connected to MongoDB!");
        } finally {
          // Ensures that the client will close when you finish/error
          // await client.close();
        }
      }
      run().catch(console.dir);
      
      const addJobsCollections = client.db('luxeMarketProCollection').collection('addJobsCollection');
       
      
      app.post('/jwt', async (req, res) => {
        const user = req.body;
        console.log('user for token', user);
        const token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '1h' });
      
        res.cookie('token', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'none'
      })
          .send({ success: true });
      })
      
      app.post('/logout', async (req, res) => {
        const user = req.body;
        console.log('logging out', user);
        res.clearCookie('token', { maxAge: 0 }).send({ success: true })
      })
      
      // tabs
     
      
      app.post('/addJobs', async(req, res) => {
          const newJobs = req.body;
          const result = await addJobsCollections.insertOne(newJobs)
          res.send(result)
       })
      
      app.get("/allJobs", async(req, res) => {
        const allJobs = await addJobsCollections.find().toArray()
        res.send(allJobs)
      })
      
      
     




app.get("/", (req, res) => {
    res.send("Welcome to our Luxe Market Pro")
})
app.listen(port, () => {
    console.log(`Welcome to our Luxe Market Pro ${port}` );
})