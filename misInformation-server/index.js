const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000

require('dotenv').config();
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mongo-simple-crud.tzwys72.mongodb.net/?appName=Mongo-simple-crud`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

async function mongodbConnect() {
    if (db) return db;
    await client.connect();
    db = client.db("Mis-Information");
    console.log("MongoDB Connected");
    return db;
    //   try {
    //     // Connect the client to the server	(optional starting in v4.7)
    //     await client.connect();
    //     // Send a ping to confirm a successful connection
    //     await client.db("admin").command({ ping: 1 });
    //     console.log("Pinged your deployment. You successfully connected to MongoDB!");
    //   } finally {
    //     // Ensures that the client will close when you finish/error
    //     await client.close();
    //   }
}

app.post("/users", async (req, res) => {
    try {
        const db = await mongodbConnect();
        const user = req.body;
        user.role = "user";

        user.createdAt = new Date();

        const result = await db.collection("users").insertOne(user);

        res.send(result);
    } catch (err) {
        res.status(500).send(err.message);
    }
})
app.get("/users", async (req, res) => {
    try {
        const db = await mongodbConnect();
        const result = await db.collection("users").find().toArray();
        res.send(result);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
app.get("/users/:id", async (req, res) => {
    try {
        const db = await mongodbConnect();
        const id = req.params.id
        const result = await db.collection("users").findOne({
            _id: new ObjectId(id),
        });
        res.send(result)
    } catch (err) {
        res.status(500).send(err.message);
    }
})
app.patch("/users/:id", async (req, res) => {
    try {
        const db = await mongodbConnect();
        const { id } = req.params;
        const { role } = req.body;
        const result = await db.collection("users").updateOne(
            { _id: new ObjectId(id) },
            { $set: { role } },
        );
        res.send(result)
    } catch (err) {
        res.status(500).send(err.message)
    }
})
app.delete("/users/:id", async (req, res) => {
    try {
        const db = await mongodbConnect()
        const result = await db.collection("users").deleteOne({
            _id: new ObjectId(req.params.id)
        });

        res.send(result)
    } catch (err) {
        res.status(500).send(err.message)
    }
});
app.get('/', (req, res) => {
    res.send('Misinformation server!')
})


function MisInformationRiskRanking(data) {
    app.post(`/${data}`, async (req, res) => {
        try {
            const db = await mongodbConnect();
            const newData = req.body;
            const result = await db.collection(data).insertOne(newData);

            res.send(result);
        } catch (err) {
            res.status(500).send(err.message);
        }
    })
    app.get(`/${data}`,async(req,res)=>{
        try{
            const db = await mongodbConnect();
            const cursor = db.collection(data).find();
            const result = await cursor.toArray();
            res.send(result);
        }catch(err){
            res.status(500).send(err.message);
        }
    })
    app.get(`/${data}/:id`,async(req,res)=>{
        try{
            const db = await mongodbConnect();
            const id = req.params.id;
            const query = {
                _id : new ObjectId(id)
            };
            const result = await db.collection(data).findOne(query);
            res.send(result);
        }catch(err){
            res.status(500).send(err.message);
        }
    })
    app.patch(`/${data}/:id`,async(req,res)=>{
        try{
            const db = await mongodbConnect();
            const id = req.params.id;
            const body = {...req.body};
            delete body._id;

            const filter = { _id:new ObjectId(id)};
            const updateDoc = {$set:body};

            const result = await db.collection(data).updateOne(filter,updateDoc);

            res.send(result);
        }catch(err){
            res.status(500).send(err.message);
        }
    })
    app.delete(`/${data}/:id`,async(req,res)=>{
        try{
            const db = await mongodbConnect();
            const result = await db.collection(data).deleteOne({
                _id : new ObjectId(req.params.id)
            });
            res.send(result);
        }catch(err){
            res.status(500).send(err.message);
        }
    })
}


const allCollections = [
    "inputSurvey"
]
allCollections.forEach(data => MisInformationRiskRanking(data))

module.exports = app;
if (process.env.NODE_ENV !== "production") {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running on port ${port} and Mongodb Connected`);
    });
}