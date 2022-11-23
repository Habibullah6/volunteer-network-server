
const express = require('express')
const { MongoClient, ServerApiVersion, MongoRuntimeError } = require('mongodb');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
require("dotenv").config();
const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h6ly4.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const database = client.db("volunteer-network");
        const eventCollection = database.collection("events");
        const eventRegisterCollection = database.collection("eventRegister")
        // GET API
        app.get('/events', async (req, res) => {
            const cursor = eventCollection.find({})
            const result = await cursor.toArray();

            res.send(result)
        })
        
        app.post('/events', async(req, res) => {
            const event = req.body;
            const result = await eventCollection.insertOne(event);
            res.send(result)
        })

       
        // GET SINGLE EVENT

        app.get('/events/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await eventCollection.findOne(query);
            res.send(result)
        })

        // POST API
        app.post('/eventRegister', async (req, res) => {
            const event = req.body;
            const result = await eventRegisterCollection.insertOne(event);
            res.send(result)
        })
 

        app.get('/eventRegister/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email:  { $in: [ email ] } }
            const result = await eventRegisterCollection.find(query).toArray();
            res.send(result)
        })
        
        app.get('/eventRegister', async(req, res) => {
            const cursor = eventRegisterCollection.find({})
            const result = await cursor.toArray();
            res.send(result)
        })

        app.delete('/eventRegister/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await eventRegisterCollection.deleteOne(query)
            res.send(result)
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('hello world this is my first express server!')
})


app.listen(port, () => {
    console.log(` app listening on port ${port}`)
})