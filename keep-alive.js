#!/usr/bin/env node

/**
 * Keep-Alive Script for Render Free Tier
 * Prevents the backend from sleeping by pinging it periodically
 */

import fetch from "node-fetch";

const API_BASE = "https://grocerease-1-wakl.onrender.com";
const INTERVAL = 10 * 60 * 1000; // 10 minutes

async function pingServer() {
  try {
    console.log(`🏓 Pinging server at ${new Date().toISOString()}`);
    const response = await fetch(`${API_BASE}/keep-alive`, {
      timeout: 10000,
      headers: {
        "User-Agent": "Keep-Alive/1.0",
      },
    });

    if (response.ok) {
      console.log(`✅ Server responded: ${response.status}`);
    } else {
      console.log(`❌ Server error: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Ping failed: ${error.message}`);
  }
}

function startKeepAlive() {
  console.log("🚀 Starting keep-alive service...");
  console.log(`📡 Pinging ${API_BASE} every ${INTERVAL / 1000 / 60} minutes`);

  // Initial ping
  pingServer();

  // Set up interval
  setInterval(pingServer, INTERVAL);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startKeepAlive();
}

export { pingServer };
