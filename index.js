const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.td49h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("auqadb");
    const productsCollection = database.collection("allproducts");
    const purchaseCollection = database.collection("purchase_collection");

    app.get("/allorders", async (req, res) => {
      const email = req.query.email;

      const query = { email: email };

      const cursor = purchaseCollection.find(query);
      const products = await cursor.toArray();
      res.json(products);
    });

    app.post("/addnewproduct", async (req, res) => {
      const addProduct = req.body;
      const result = await productsCollection.insertOne(addProduct);
      res.json(result);
    });

    app.get("/allproducts", async (req, res) => {
      const cursor = await productsCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    app.get("/allproducts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const addProduct = await productsCollection.findOne(query);
      res.json(addProduct);
    });

    app.get("/allorders", async (req, res) => {
      const cursor = await purchaseCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    app.post("/completePurches", async (req, res) => {
      const completePurchase = req.body;
      const result = await purchaseCollection.insertOne(completePurchase);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Express");
});

app.listen(port, () => {
  console.log(`Listening to the port ${port}`);
});
