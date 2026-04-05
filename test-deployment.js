#!/usr/bin/env node

/**
 * Deployment Verification Script
 * Tests all critical endpoints and services
 */

import fetch from "node-fetch";

const API_BASE = "https://grocerease-1-wakl.onrender.com";
const FRONTEND_URL = "https://grocer-ease-tawny.vercel.app";

async function testEndpoint(url, description) {
  try {
    console.log(`🔍 Testing ${description}...`);
    const response = await fetch(url, {
      timeout: 10000,
      headers: {
        "User-Agent": "Deployment-Test/1.0",
      },
    });

    if (response.ok) {
      console.log(`✅ ${description}: ${response.status}`);
      return true;
    } else {
      console.log(
        `❌ ${description}: ${response.status} ${response.statusText}`,
      );
      return false;
    }
  } catch (error) {
    console.log(`❌ ${description}: ${error.message}`);
    return false;
  }
}

async function testCORS(url, description) {
  try {
    console.log(`🔍 Testing CORS for ${description}...`);
    const response = await fetch(url, {
      method: "OPTIONS",
      headers: {
        Origin: FRONTEND_URL,
        "Access-Control-Request-Method": "GET",
      },
      timeout: 10000,
    });

    const corsHeader = response.headers.get("access-control-allow-origin");
    if (
      corsHeader &&
      (corsHeader === "*" || corsHeader.includes("vercel.app"))
    ) {
      console.log(`✅ CORS ${description}: Allowed`);
      return true;
    } else {
      console.log(`❌ CORS ${description}: Not properly configured`);
      return false;
    }
  } catch (error) {
    console.log(`❌ CORS ${description}: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log("🚀 Starting GrocerEase Deployment Verification\n");

  const tests = [
    // Backend tests
    { url: `${API_BASE}/`, description: "Backend Root" },
    { url: `${API_BASE}/health`, description: "Backend Health Check" },
    { url: `${API_BASE}/api/category/get`, description: "API Categories" },

    // CORS tests
    {
      url: `${API_BASE}/api/category/get`,
      description: "API CORS",
      cors: true,
    },

    // Frontend test
    { url: FRONTEND_URL, description: "Frontend" },
  ];

  let passed = 0;
  let total = tests.length;

  for (const test of tests) {
    if (test.cors) {
      if (await testCORS(test.url, test.description)) passed++;
    } else {
      if (await testEndpoint(test.url, test.description)) passed++;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Rate limiting
  }

  console.log(`\n📊 Results: ${passed}/${total} tests passed`);

  if (passed === total) {
    console.log("🎉 All tests passed! Deployment is working correctly.");
    process.exit(0);
  } else {
    console.log("⚠️  Some tests failed. Check the deployment configuration.");
    process.exit(1);
  }
}

runTests().catch(console.error);
