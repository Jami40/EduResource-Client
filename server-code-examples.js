// Updated server code with better error handling and logging
// This is an improved version of your current server code

const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.knxzg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const resourcesCollection = client.db("edudDb").collection("resources");
    const userCollection = client.db("edudDb").collection("users");
    const requestsCollection = client.db("edudDb").collection("requests");

    // Get all users
    app.get('/users', async (req, res) => {
      try {
        const users = await userCollection.find({}).toArray();
        res.send(users);
      } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    // Get user by email
    app.get('/users/:email', async (req, res) => {
      try {
        const email = req.params.email;
        const user = await userCollection.findOne({ email });
        if (!user) {
          return res.status(404).send({ message: 'User not found' });
        }
        res.send(user);
      } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    // Update user profile
    app.patch('/users/:email', async (req, res) => {
      try {
        const email = req.params.email;
        const updates = req.body;
        const result = await userCollection.updateOne(
          { email: email },
          { $set: updates }
        );
        if (result.modifiedCount > 0) {
          res.send({ message: 'User updated successfully' });
        } else {
          res.status(404).send({ message: 'User not found' });
        }
      } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    // Create new user
    app.post('/users', async (req, res) => {
      try {
        const user = req.body;
        const query = { email: user.email };
        const existingUser = await userCollection.findOne(query);
        if (existingUser) {
          return res.send({ message: 'User already exists' });
        }
        const result = await userCollection.insertOne(user);
        res.send(result);
      } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    // Get all resources
    app.get('/resources', async (req, res) => {
      try {
        const resources = await resourcesCollection.find().toArray();
        res.send(resources);
      } catch (error) {
        console.error('Error fetching resources:', error);
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    // Create new resource (Admin only)
    app.post('/resources', async (req, res) => {
      try {
        const resource = req.body;
        const result = await resourcesCollection.insertOne(resource);
        res.send(result);
      } catch (error) {
        console.error('Error creating resource:', error);
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    // Update resource (Admin only)
    app.put('/resources/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const updates = req.body;
        const result = await resourcesCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updates }
        );
        if (result.modifiedCount > 0) {
          res.send({ message: 'Resource updated successfully' });
        } else {
          res.status(404).send({ message: 'Resource not found' });
        }
      } catch (error) {
        console.error('Error updating resource:', error);
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    // Delete resource (Admin only)
    app.delete('/resources/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const result = await resourcesCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount > 0) {
          res.send({ message: 'Resource deleted successfully' });
        } else {
          res.status(404).send({ message: 'Resource not found' });
        }
      } catch (error) {
        console.error('Error deleting resource:', error);
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    // Get all requests
    app.get('/api/requests', async (req, res) => {
      try {
        const requests = await requestsCollection.find({}).toArray();
        res.send(requests);
      } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    // Get requests by user email
    app.get('/api/requests/user/:email', async (req, res) => {
      try {
        const email = req.params.email;
        const requests = await requestsCollection.find({ userEmail: email }).toArray();
        res.send(requests);
      } catch (error) {
        console.error('Error fetching user requests:', error);
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    // Create new request
    app.post('/api/requests', async (req, res) => {
      try {
        const request = req.body;
        const result = await requestsCollection.insertOne(request);
        res.send(result);
      } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    // Update request status (Admin only)
    app.patch('/api/requests/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const updates = req.body;
        const result = await requestsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updates }
        );
        if (result.modifiedCount > 0) {
          res.send({ message: 'Request updated successfully' });
        } else {
          res.status(404).send({ message: 'Request not found' });
        }
      } catch (error) {
        console.error('Error updating request:', error);
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB!");
    console.log("🚀 Server is ready to handle requests!");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Edu resource running');
});

app.listen(port, () => {
  console.log(`🎯 Edu resource server running on port ${port}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down server...');
  await client.close();
  process.exit(0);
}); 