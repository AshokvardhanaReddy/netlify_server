
import express, { Router } from "express";
import { MongoClient, ObjectId } from 'mongodb';

import serverless from "serverless-http";

const mongoUri = 'mongodb+srv://yashokvardhanreddy:srff-cluster1995@srff-cluster.dhto4.mongodb.net/sr_frozen_foods?retryWrites=true&w=majority';
const client = new MongoClient(mongoUri);
const database = client.db('sr_frozen_foods');


const api = express();

const router = Router();
// router.get("/hello", (req, res) => res.send("Hello World!"));

router.get("/:collectionName", async (req, res) =>{
    const { collectionName } = req.params;
    try {
        const collection = database.collection(collectionName);
        const data = await collection.find().toArray();
        console.log(data)
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

api.use("/api/", router);

export const handler = serverless(api);
