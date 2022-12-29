const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7czv3fq.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const usersCollection = client.db("taskManagement").collection("users");
    const mediasCollection = client.db("taskManagement").collection("medias");
    const tasksCollection = client.db("taskManagement").collection("tasks");

    //  post
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.post("/medias", async (req, res) => {
      const media = req.body;
      const result = await mediasCollection.insertOne(media);
      res.send(result);
    });

    app.post("/tasks", async (req, res) => {
      const userTask = req.body;
      const result = await tasksCollection.insertOne(userTask);
      res.send(result);
    });

    // get
    app.get('/tasks', async (req, res) => {
        const email = req.query.email;
        const query = { email: email };
        const tasks = await tasksCollection.find(query).toArray();
        res.send(tasks);
    });


    // delete
    app.delete('/tasks/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
        const result = await tasksCollection.deleteOne(filter);
        res.send(result);
    });
  } finally {
  }
}
run().catch(console.log);

app.get("/", (req, res) => {
  res.send("Task management API Running");
});

app.listen(port, () => {
  console.log("Task Management Server running on port", port);
});
