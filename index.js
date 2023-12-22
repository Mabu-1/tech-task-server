const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();

// middleware
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5001;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ibabnwm.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const taskCollection = client.db("techDB").collection("tasks");

    app.get("/tasks", async (req, res) => {
        const userEmail = req.query.user; // Assuming userEmail is a string
        const result = await taskCollection.find({ email: userEmail }).toArray();
        console.log(result);
        res.send(result);
      });
      

    app.post("/tasks", async (req, res) => {
      try {
        const body = req.body;
        const result = await taskCollection.insertOne(body);
        console.log(result);
        res.send(result);
      } catch (error) {
        console.log(error);
        res.status(500).send(error);
      }
    });


    app.put('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedTask = req.body;
    
      const products = {
          $set: {
    
              title: updatedTask.title,
              description: updatedTask.description,

              deadline: updatedTask.deadline,
              priority: updatedTask.priority,
             
             
          }
      }
    
      const result = await taskCollection.updateOne(filter, products, options);
      res.send(result);
    })

    app.delete('/task/:id', async (req, res) => {
      try{
          const id = req.params.id;
          const query = { _id: new ObjectId(id) }
          const result = await taskCollection.deleteOne(query);
          res.send(result);
      } catch(error)
      {
          console.log(error)
      }
        
    })
    

    console.log("Connected to MongoDB successfully!");
  } finally {
    // Ensure that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Crud is running .....");
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
