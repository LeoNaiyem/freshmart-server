const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

//MIDDLEWARE
app.use(cors());
app.use(bodyParser.json());

//mongodb connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6w64q.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("FreshMart");
    const productCollection = database.collection("products");
    const orderCollection = database.collection("orders");

    //loading products form database
    app.get("/products", async (req, res) => {
      const product = await productCollection.find().toArray();
      res.send(product);
    });
    // loading single product by id
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.send(product);
    });

    // loading orders by email
    app.get('/orders', async (req, res) => {
      const email = req.query.email;
      const filter = {customerEmail: email};
      const orders = await orderCollection.find(filter).toArray();
      res.send(orders);
    })

    //sending product information to database
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    });

    //sending orders info to database
    app.post('/orders', async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    })

    // removing data from Database

    //deleting product from database
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      if (result.deletedCount === 1) {
        res.send(result);
      } else {
        console.log("No documents matched the query. Deleted 0 documents.");
      }
    });

    //deleting orders from the database
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      if (result.deletedCount === 1) {
        res.send(result);
      } else {
        console.log("No documents matched the query. Deleted 0 documents.");
      }
    });

    console.log("FreshMart Database Connected Successfully");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Freshmart Co-op Server Is Running");
});

app.listen(PORT, () => {
  console.log(`Freshmart Co-op listening at http://localhost:${PORT}`);
});
