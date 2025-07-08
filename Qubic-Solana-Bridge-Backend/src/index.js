require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const { confirmQubicTx } = require("./verify");
const { createAndMintTokens } = require("./mint");
const cors = require("cors");

const app = express();
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

app.use(bodyParser.json());
app.use(cors());

// --- Initialize DB ---
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS lock_events (
      id SERIAL PRIMARY KEY,
      tick BIGINT UNIQUE,
      tx_hash TEXT,
      amount BIGINT,
      solana_address TEXT,
      status TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

// --- API Endpoint ---
app.post("/api/lock-and-mint", async (req, res) => {
  const { tick, qubicTxHash, amount, solanaAddress } = req.body;
  console.log("request received");

  try {
    await pool.query(
      `INSERT INTO lock_events (tick, tx_hash, amount, solana_address, status)
       VALUES ($1, $2, $3, $4, 'pending')
       ON CONFLICT (tick) DO NOTHING`,
      [tick, qubicTxHash, amount, solanaAddress]
    );
    const isValid = await confirmQubicTx(qubicTxHash);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid Qubic transaction" });
    }
    const { success, signature } = await createAndMintTokens(
      amount,
      solanaAddress
    );
    if (!success) {
      return res.status(500).json({ error: "Failed to mint wQUBIC on Solana" });
    }
    await pool.query(
      `UPDATE lock_events SET status = 'minted' WHERE tick = $1`,
      [tick]
    );

    return res.json({ success: true, signature });
  } catch (err) {
    console.error("Error in lock-and-mint:", err);
    return res
      .status(500)
      .json({ error: "Server error", details: err.message });
  }
});

// --- Background Worker ---
async function processPendingLocks() {
  console.log("Checking for pending lock events...");
  const { rows } = await pool.query(
    `SELECT * FROM lock_events WHERE status = 'pending'`
  );
  for (const row of rows) {
    const { tick, tx_hash, amount, solana_address } = row;
    const isValid = await confirmQubicTx(tx_hash);
    if (isValid) {
      const { success, txSig } = await createAndMintTokens(
        amount,
        solana_address
      );
      if (success) {
        await pool.query(
          `UPDATE lock_events SET status = 'minted' WHERE tick = $1`,
          [tick]
        );
        console.log(`Minted wQUBIC to ${solana_address} | tick: ${tick}`);
      }
    }
  }
}

// setInterval(processPendingLocks, 5000); // Poll every 5 seconds

// --- Start Server ---
initDB().then(() => {
  app.listen(8000, () => {
    console.log("Relayer backend running on http://localhost:8000");
  });
});
