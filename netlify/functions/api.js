
import express from "express";
import { MongoClient, ObjectId } from 'mongodb';

import serverless from "serverless-http";
// const PORT = process.env.PORT || 5000;

const mongoUri = 'mongodb+srv://yashokvardhanreddy:srff-cluster1995@srff-cluster.dhto4.mongodb.net/sr_frozen_foods?retryWrites=true&w=majority';
const client = new MongoClient(mongoUri);
const database = client.db('sr_frozen_foods');

const api = express();

api.get("/api/:collectionName", async (req, res) =>{
    const { collectionName } = req.params;
    try {
        const collection = database.collection(collectionName);
        const data = await collection.find().toArray();
        console.log(data)
        res.send(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})


// POST Method
api.post('/api/:collectionName', async (req, res) => {
    const { collectionName } = req.params;
    try {
        const newData = req.body;
        const collection = database.collection(collectionName);
        const result = await collection.insertOne(newData);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error adding data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// PUT Method
api.put('/api/:collectionName/:id', async (req, res) => {
    const { collectionName, id } = req.params;
    try {
        const { customer_name, customer_mobile, customer_office } = req.body;
        const collection = database.collection(collectionName);
        const updatedUser = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { customer_name: customer_name, customer_mobile: customer_mobile, customer_office: customer_office } });
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(500).send('Server Error');
    }
});


// DELETE Method
api.delete('/api/:collectionName/:id', async (req, res) => {
    console.log(req.params)
    const { collectionName, id } = req.params;
    try {
        const collection = database.collection(collectionName)
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 1) {
            res.status(200).json({ message: 'Document deleted successfully' });
        } else {
            res.status(404).json({ message: 'Document not found' });
        }
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// export const handler = serverless(api);
