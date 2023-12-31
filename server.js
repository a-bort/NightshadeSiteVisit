//.ENV access
require('dotenv').config();
//SERVER FRAMEWORK
const fastify = require('fastify')({ logger: true });
//SERVE STATIC FILES
const fs = require('@fastify/static');
const path = require("path");
//DB CONNECTION
const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoUri = process.env.MONGO_URI;
const client = new MongoClient(mongoUri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function testDbConnection() {
    try {
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
async function insertSiteVisit(request) {
    try {
        await client.connect();
        await client.db(process.env.DB_NAME).collection(process.env.SITE_VISIT_COLLECTION).insertOne(request.body);
        console.log("Inserted one row");
    }
    catch (e) {
        console.log("Error Inserting");
        console.log(e);
    }
    finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
testDbConnection().catch(console.dir);
//JSON SCHEMA
const siteVisitRequest = {
    schema: {
        body: {
            type: 'object',
            properties: {
                site: { type: 'string' },
                visitDate: { type: 'string' },
                visitDuration: { type: 'number' },
                weeding: { type: 'boolean' },
                plants: { type: 'string' },
                attrition: { type: 'string' },
                followUp: { type: 'string' },
                businessNotes: { type: 'string' }
            }
        }
    }
};
//ROUTES
fastify.register(fs, {
    root: path.join(__dirname, 'public'),
    prefix: '/public/',
});
fastify.get('/', async ( /*request, reply*/) => {
    return { hello: 'world' };
});
fastify.get('/index', (request, reply) => {
    reply.sendFile('index.html');
});
fastify.get('/sitevisit', (request, reply) => {
    reply.sendFile('record-visit.html');
});
fastify.post('/sitevisit/create', siteVisitRequest, (request, reply) => {
    console.log(request.body);
    insertSiteVisit(request);
    return { post: 'success' };
});
fastify.get('/sitevisit/all', (request, reply) => {
    return { siteVisits: [{ object: 1 }, { object: 2 }] };
});
//RUN SERVER
const startWebServer = async () => {
    try {
        await fastify.listen({ port: process.env.port });
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
startWebServer();
