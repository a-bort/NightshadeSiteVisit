require('dotenv').config();
const fastify = require('fastify')({ logger: true })
const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoUri = process.env.MONGO_URI;

const client = new MongoClient(mongoUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

fastify.get('/', async (/*request, reply*/) => {
  return { hello: 'world' }
});

async function runDb() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
runDb().catch(console.dir);

/**
 * Run the webserver!
 */
const startWebServer = async () => {
  try {
    await fastify.listen({ port: process.env.port })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
startWebServer();