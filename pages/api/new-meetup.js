// /api/new-meetup

import { MongoClient } from "mongodb";

async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const data = req.body;

      const client = await MongoClient.connect(
        "mongodb+srv://EvaldasTest:0ZLhsfkwot0CuqVZ@cluster0.wo9dz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      );

      const db = client.db();
      const meetupsCollection = db.collection("meetups");

      const result = await meetupsCollection.insertOne(data);
      client.close();

      return res.status(201).json({
        message: "Meetup inserted",
        id: result.insertedId,
      });
    } catch (error) {
      return res.status(500).json({ message: "Database error" });
    }
  }

  // 👇 THIS FIXES YOUR ERROR
  res.status(405).json({ message: "Method not allowed" });
}

export default handler;
