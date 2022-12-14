const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// .env file
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
// body diye jei data paai (get) or pathai (post), ta parse krte lage express.json()
app.use(express.json());

// database
// username: risalshahed
// password: XokGIXvZaz98vnSn

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0qtxh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const serviceCollection = client.db('geniusCar').collection('service');

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