#!/usr/bin/env node

/**
 * Wait for Render Deployment Script
 * Continuously checks if the server has been redeployed
 */

import fetch from 'node-fetch';

const API_BASE = 'https://grocerease-1-wakl.onrender.com';
const CHECK_INTERVAL = 30000; // 30 seconds

async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE}/health`, {
      timeout: 10000
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Health endpoint is now available!');
      console.log('📊 Health status:', data.status);
      console.log('⏱️  Server uptime:', Math.round(data.uptime), 'seconds');
      return true;
    } else {
      console.log(`❌ Health endpoint still returning ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Health check failed: ${error.message}`);
    return false;
  }
}

async function waitForDeployment() {
  console.log('🔄 Waiting for Render deployment to complete...');
  console.log(`📡 Checking ${API_BASE}/health every ${CHECK_INTERVAL / 1000} seconds`);

  let attempts = 0;
  while (true) {
    attempts++;
    console.log(`\n🔍 Attempt ${attempts} at ${new Date().toLocaleTimeString()}`);

    if (await checkHealth()) {
      console.log('\n🎉 Deployment completed successfully!');
      break;
    }

    console.log(`⏳ Waiting ${CHECK_INTERVAL / 1000} seconds before next check...`);
    await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
  }
}

waitForDeployment().catch(console.error);