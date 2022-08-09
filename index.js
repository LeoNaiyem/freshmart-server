const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

//MIDDLEWARE
app.use(cors());
app.use(bodyParser.json());


//mongodb connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6w64q.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    const database = client.db("FreshMart");
    const productCollection = database.collection("products");




    console.log('FreshMart Database Connected Successfully');
  } finally {
    await client.close();
  }
}
run().catch(console.dir);



app.get("/", (req, res) => {
  res.send("Freshmart Co-op Is Running");
});

app.listen(PORT, () => {
  console.log(`Freshmart Co-op listening at http://localhost:${PORT}`);
});
