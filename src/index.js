const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const { Client } = require('pg');

const app = express();
const port = 4000;

// ---PostgreSQL---
const Postgres_USER = 'root';
const Postgres_PASSWORD = 'example';
const Postgres_HOST = 'postgres';
const Postgres_PORT = 5432;
const Postgres_URI = `postgresql://${Postgres_USER}:${Postgres_PASSWORD}@${Postgres_HOST}:${Postgres_PORT}`;

const postgresClient = new Client({
  connectionString: Postgres_URI
});

postgresClient.connect()
  .then(() => console.log('Connecté à PostgreSQL !'))
  .catch(err => console.log('Échec de connexion PostgreSQL :', err));

// --- MongoDB ---
const DB_USER = 'root';
const DB_PASSWORD = 'example';
const DB_HOST = 'mongo';
const DB_PORT = 27017;
const URI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`;

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connecté à MongoDB !'))
.catch(err => console.log('Échec de connexion MongoDB :', err));

// --- Redis ---
const REDIS_HOST = 'redis';
const REDIS_PORT = 6379;
const redisClient = redis.createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`
});

(async () => {
  try {
    await redisClient.connect(); // Connexion obligatoire
    console.log('Connecté à Redis !');
  } catch (err) {
    console.error('Erreur Redis :', err);
  }
})();

// --- Routes ---
app.get('/', async (req, res) => {
  try {
    await redisClient.set('products', 'product....'); 
    res.send('<h1>Hello, World!!! hi</h1>');
  } catch (err) {
    res.status(500).send('Erreur Redis');
  }
});

app.get('/data', async (req, res) => {
  try {
    const products = await redisClient.get('products'); 
    res.send(`<h1>I=Dhia Rezgui : Software Engineer</h1><p>${products}</p>`);
  } catch (err) {
    res.status(500).send('Erreur Redis');
  }
});

// --- Serveur ---
app.listen(port, () => console.log(`Server running on port ${port}`));
