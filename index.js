const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// .env file
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
// body diye jei data paai (get) or pathai (post), ta parse krte lage express.json()
app.use(express.json());

// verify Token sent from frontend
function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  // console.log('Inside verifyJWT', authHeader);
  if(!authHeader) {
    res.status(401).send({message: 'unauthorized access'});
  }
  const token = authHeader.split(' ')[1];
  // jwt verify kro with secret, koira nicher steps kro
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if(err) {
      return res.status(403).send({message: 'Forbidden access'});
    }
    // if no error, then this three lines
    console.log('decoded', decoded);
    req.decoded = decoded;
    next();
  })
}

// database

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0qtxh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const serviceCollection = client.db('geniusCar').collection('service');
    const orderCollection = client.db('geniusCar').collection('order');

    /* 
    -----------------
    AUTH (JWT Token)
    -----------------
    */
    //  require('crypto').randomBytes(64).toString('hex')
    app.post('/login', async (req, res) => {
      const user = req.body;
      // const accessToken = jwt.sign('ki info rakhbo', 'secret_token')
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d',  // 1d means one day
      });
      res.send(accessToken);
    })
   

    
    /*
    -----------------------
    SERVICE Collection API
    -----------------------
    */
    // find multiple
    // https://www.mongodb.com/docs/drivers/node/current/usage-examples/find/
    app.get('/service', async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    })
    // find one
    // https://www.mongodb.com/docs/drivers/node/current/usage-examples/findOne/
    app.get('/service/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const service = await serviceCollection.findOne(query);
      res.send(service);
    })
    // insert one
    // https://www.mongodb.com/docs/drivers/node/current/usage-examples/insertOne/
    app.post('/service', async (req, res) => {
      const newService = req.body;
      const result = await serviceCollection.insertOne(newService);
      res.send(result);
    })
    // DELETE
    app.delete('/service/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await serviceCollection.deleteOne(query);
      res.send(result);
    })

    /*
    ---------------------
    ORDER Collection API
    ---------------------
    */
    app.get('/order', verifyJWT, async (req, res) => {
      const decodedEmail = req.decoded.email;
      // shobar shob order dekhabe! kin2 amra to ek user k arek user er order dekhabo na! tai amra email alada kore nibo query te, query er email onujayi dekhabo order
      const email = req.query.email;
      // console.log(email);
      if(email === decodedEmail) {
        const query = {email: email};
        const cursor = orderCollection.find(query);
        const orders = await cursor.toArray();
        res.send(orders);
      } else {
        res.status(403).send({message: 'Forbidden access'});
      }
    })

    app.post('/order', async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    })



  }
  finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('welcome genius, missed coding?');
})


app.listen(port, () => {
  console.log('listeningaaa');
})