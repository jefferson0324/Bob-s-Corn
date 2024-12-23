const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const pool = new Pool({
  connectionString: 'postgresql://postgres:root@127.0.0.1:5432/air-paramedical',
});

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

app.post('/buy-corn', async (req, res) => {
  const clientId = req.body.clientId;

  if (!clientId) {
    return res.status(400).send('Client ID is required.');
  }

  const now = new Date();
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS corn_purchases (
        id SERIAL PRIMARY KEY,
        client_id VARCHAR(255),
        purchase_time TIMESTAMP
      )
    `);

    const result = await pool.query(
      `SELECT purchase_time FROM corn_purchases WHERE client_id = $1 ORDER BY purchase_time DESC LIMIT 1`,
      [clientId]
    );

    if (result.rows.length > 0) {
      const lastPurchase = new Date(result.rows[0].purchase_time);
      if (now - lastPurchase < 60000) {
        return res.status(429).send('Too Many Requests');
      }
    }

    await pool.query(
      `INSERT INTO corn_purchases (client_id, purchase_time) VALUES ($1, $2)`,
      [clientId, now]
    );

    return res.status(200).send('🌽');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
});

const PORT = 4444;
app.listen(PORT, () => {
  console.log(`Farmer Bob's corn API is running on port ${PORT}`);
});