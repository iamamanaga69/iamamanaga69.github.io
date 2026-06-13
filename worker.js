const ALLOWED_ORIGINS = [
  "https://flexist.in",
  "https://www.flexist.in",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5500",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5500",
  "null"
];

const RPC_ENDPOINTS = {
  ethereum: "https://cloudflare-eth.com",
  bnb: "https://binance.llamarpc.com",
  polygon: "https://polygon-rpc.com",
  base: "https://mainnet.base.org",
  arbitrum: "https://arb1.arbitrum.io/rpc"
};

const PLAN_PRICING = {
  onetime: {
    indiaentry: 500,
    indiagrowth: 1200
  },
  monthly: {
    indiaentry: 350,
    indiagrowth: 800,
    indiapartner: 1800
  }
};

const TOKENS = {
  ethereum: {
    USDT: { contract: "0xdac17f958d2ee523a2206206994597c13d831ec7", decimals: 6 }
  },
  bnb: {
    USDT: { contract: "0x55d398326f99059ff775485246999027b3197955", decimals: 18 }
  },
  polygon: {
    USDT: { contract: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f", decimals: 6 }
  },
  base: {
    USDT: { contract: "0x50c5725949a5f0f72967f183cdd7939472605e5e", decimals: 6 } // Bridged USDT
  },
  arbitrum: {
    USDT: { contract: "0xfd086bc7cd5c481d27fc2975937db87f8248d2fc", decimals: 6 }
  }
};

// Base58 Decoder for Tron Address
const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const ALPHABET_MAP = {};
for (let i = 0; i < ALPHABET.length; i++) {
  ALPHABET_MAP[ALPHABET[i]] = i;
}

function base58Decode(string) {
  if (string.length === 0) return new Uint8Array(0);
  const bytes = [0];
  for (let i = 0; i < string.length; i++) {
    const c = string[i];
    if (!(c in ALPHABET_MAP)) throw new Error("Non-base58 character");
    let carry = ALPHABET_MAP[c];
    for (let j = 0; j < bytes.length; j++) {
      carry += bytes[j] * 58;
      bytes[j] = carry & 0xff;
      carry >>= 8;
    }
    while (carry > 0) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }
  for (let i = 0; string[i] === "1" && i < string.length - 1; i++) {
    bytes.push(0);
  }
  return new Uint8Array(bytes.reverse());
}

function tronAddressToHex(address) {
  const bytes = base58Decode(address);
  const addressBytes = bytes.slice(0, 21);
  return Array.from(addressBytes, byte => byte.toString(16).padStart(2, "0")).join("").toLowerCase();
}

// Generate payment ID
function generatePaymentId(planName, chainName) {
  const prefix = "FLX";
  const planShort = (planName || "CSM").slice(0, 3).toUpperCase();
  const chainShort = (chainName || "ETH").slice(0, 3).toUpperCase();
  const timestampBase36 = Date.now().toString(36).toUpperCase().slice(-5);
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${planShort}-${chainShort}-${timestampBase36}${randomSuffix}`;
}

// CORS helper to construct response headers dynamically
function getCorsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get("Origin");

    // Reject requests from non-whitelisted origins if Origin is present
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return new Response(JSON.stringify({ error: "Forbidden: Origin not allowed" }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }

    const corsHeaders = origin ? getCorsHeaders(origin) : { "Content-Type": "application/json" };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    // ── Webhook and registrations bypass IP rate limiting ──
    if (url.pathname === "/telegram-webhook" && request.method === "POST") {
      return handleTelegramWebhook(request, env, corsHeaders);
    } else if (url.pathname === "/register-ticket" && request.method === "POST") {
      return handleRegisterTicket(request, env, corsHeaders);
    } else if (url.pathname === "/register-creator" && request.method === "POST") {
      return handleRegisterCreator(request, env, corsHeaders);
    }

    const ip = request.headers.get("CF-Connecting-IP") || "127.0.0.1";

    // ── RATE LIMITER (5 attempts per minute per IP via KV) ──
    const minuteBucket = Math.floor(Date.now() / 60000);
    const limitKey = `rate:${ip}:${minuteBucket}`;
    const rateData = await env.VERIFIED_TXIDS.get(limitKey);
    const rateCount = rateData ? parseInt(rateData, 10) : 0;

    if (rateCount >= 5) {
      return new Response(JSON.stringify({ error: "Too many requests. Please try again in a minute." }), {
        status: 429,
        headers: corsHeaders
      });
    }

    await env.VERIFIED_TXIDS.put(limitKey, (rateCount + 1).toString(), { expirationTtl: 60 });

    // ── ROUTER ──
    if (url.pathname === "/verify-payment" && request.method === "POST") {
      return handleVerifyPayment(request, env, ip, corsHeaders);
    } else if (url.pathname === "/verify-hash" && request.method === "POST") {
      return handleVerifyHash(request, env, ip, corsHeaders);
    } else if (url.pathname === "/complete-onboarding" && request.method === "POST") {
      return handleCompleteOnboarding(request, env, corsHeaders);
    } else if (url.pathname === "/payment-status" && request.method === "GET") {
      return handlePaymentStatus(url, env, corsHeaders);
    }

    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: corsHeaders
    });
  }
};

async function handlePaymentStatus(url, env, corsHeaders) {
  const txid = url.searchParams.get("txid");
  if (!txid) {
    return new Response(JSON.stringify({ error: "Missing txid parameter" }), {
      status: 400,
      headers: corsHeaders
    });
  }

  try {
    const { results } = await env.DB.prepare(
      "SELECT id, plan, payment_type, expected_amount, actual_amount, chain, token, tx_hash, name, email, telegram, project, status, created_at FROM payments WHERE tx_hash = ? OR id = ?"
    ).bind(txid, txid).all();

    if (!results || results.length === 0) {
      return new Response(JSON.stringify({ error: "Payment not found" }), {
        status: 404,
        headers: corsHeaders
      });
    }

    return new Response(JSON.stringify({ payment: results[0] }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Database error", details: err.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

// ── Step 3A: verify on-chain hash and pre-insert database log
async function handleVerifyHash(request, env, ip, corsHeaders) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400, headers: corsHeaders });
  }

  const {
    plan,
    paymentType,
    chain,
    token,
    txHash,
    turnstileToken
  } = body;

  // Validate required fields
  if (!plan || !paymentType || !chain || !token || !txHash || !turnstileToken) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: corsHeaders });
  }

  const cleanTxHash = txHash.trim();
  const lowerChain = chain.toLowerCase();
  const upperToken = token.toUpperCase();
  const lowerPlan = plan.toLowerCase().replace(/\s+/g, "");
  const lowerType = paymentType.toLowerCase().trim();

  let serverExpectedAmount;
  if (lowerPlan === "custom") {
    serverExpectedAmount = parseFloat(body.amount);
    if (isNaN(serverExpectedAmount) || serverExpectedAmount <= 0) {
      return new Response(JSON.stringify({ error: "Invalid payment amount specified for Custom plan" }), { status: 400, headers: corsHeaders });
    }
  } else {
    // Validate pricing check & calculate expected amount on server
    const pricingTier = PLAN_PRICING[lowerType];
    if (!pricingTier) {
      return new Response(JSON.stringify({ error: "Invalid plan type" }), { status: 400, headers: corsHeaders });
    }

    serverExpectedAmount = pricingTier[lowerPlan];
    if (!serverExpectedAmount) {
      return new Response(JSON.stringify({ error: "Invalid plan" }), { status: 400, headers: corsHeaders });
    }
  }

  // 1. Validate Turnstile Token
  const turnstileRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${encodeURIComponent(env.TURNSTILE_SECRET_KEY)}&response=${encodeURIComponent(turnstileToken)}&remoteip=${ip}`
  });
  const turnstileData = await turnstileRes.json();
  if (!turnstileData.success) {
    return new Response(JSON.stringify({ error: "Security validation failed. Refresh page and try again." }), { status: 400, headers: corsHeaders });
  }

  // 2. Double-Spend/Duplicate check via KV
  const kvKey = `tx:${cleanTxHash.toLowerCase()}`;
  const isDuplicate = await env.VERIFIED_TXIDS.get(kvKey);
  if (isDuplicate) {
    return new Response(JSON.stringify({ error: "Transaction hash has already been registered." }), { status: 400, headers: corsHeaders });
  }

  // 3. Verify Blockchain Transaction
  let verificationResult;
  try {
    if (["ethereum", "bnb", "polygon", "base", "arbitrum"].includes(lowerChain)) {
      verificationResult = await verifyEVM(cleanTxHash, lowerChain, upperToken, serverExpectedAmount, env);
    } else if (lowerChain === "solana") {
      verificationResult = await verifySolana(cleanTxHash, upperToken, serverExpectedAmount, env);
    } else if (lowerChain === "tron") {
      verificationResult = await verifyTron(cleanTxHash, upperToken, serverExpectedAmount, env);
    } else {
      return new Response(JSON.stringify({ error: `Unsupported blockchain: ${chain}` }), { status: 400, headers: corsHeaders });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: "Blockchain verification failed", details: err.message }), { status: 400, headers: corsHeaders });
  }

  if (!verificationResult.verified) {
    return new Response(JSON.stringify({ error: verificationResult.reason }), { status: 400, headers: corsHeaders });
  }

  // 4. Save to D1 with 'pending_onboarding' status & store in KV
  const paymentId = generatePaymentId(plan, chain);
  try {
    await env.DB.prepare(
      "INSERT INTO payments (id, plan, payment_type, expected_amount, actual_amount, chain, token, tx_hash, name, email, telegram, project, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, '', '', '', '', 'pending_onboarding')"
    ).bind(
      paymentId,
      plan,
      paymentType,
      serverExpectedAmount,
      verificationResult.actualAmount,
      chain,
      token,
      cleanTxHash
    ).run();

    // Cache verified transaction hash in KV to prevent double spend
    await env.VERIFIED_TXIDS.put(kvKey, "verified");

    return new Response(JSON.stringify({ success: true, paymentId, actualAmount: verificationResult.actualAmount }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Database registration failure", details: err.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

// ── Step 3B: update database record with user contact/project details
async function handleCompleteOnboarding(request, env, corsHeaders) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400, headers: corsHeaders });
  }

  const {
    paymentId,
    name,
    email,
    telegram,
    project
  } = body;

  // Validate required fields
  if (!paymentId || !name || !email || !telegram || !project) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: corsHeaders });
  }

  try {
    const dbRes = await env.DB.prepare(
      "UPDATE payments SET name = ?, email = ?, telegram = ?, project = ?, status = 'verified' WHERE id = ?"
    ).bind(
      name.trim(),
      email.trim(),
      telegram.trim(),
      project.trim(),
      paymentId
    ).run();

    if (dbRes.meta?.changes === 0) {
      return new Response(JSON.stringify({ error: "Payment reference not found." }), { status: 404, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Database update failure", details: err.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

// ── Legacy verify-payment fallback (processes all inputs at once)
async function handleVerifyPayment(request, env, ip, corsHeaders) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400, headers: corsHeaders });
  }

  const {
    plan,
    paymentType,
    chain,
    token,
    txHash,
    name,
    email,
    telegram,
    project,
    turnstileToken
  } = body;

  // Validate required fields
  if (!plan || !paymentType || !chain || !token || !txHash || !name || !email || !telegram || !project || !turnstileToken) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: corsHeaders });
  }

  const cleanTxHash = txHash.trim();
  const lowerChain = chain.toLowerCase();
  const upperToken = token.toUpperCase();
  const lowerPlan = plan.toLowerCase().replace(/\s+/g, "");
  const lowerType = paymentType.toLowerCase().trim();

  let serverExpectedAmount;
  if (lowerPlan === "custom") {
    serverExpectedAmount = parseFloat(body.amount);
    if (isNaN(serverExpectedAmount) || serverExpectedAmount <= 0) {
      return new Response(JSON.stringify({ error: "Invalid payment amount specified for Custom plan" }), { status: 400, headers: corsHeaders });
    }
  } else {
    // Validate pricing check & calculate expected amount on server
    const pricingTier = PLAN_PRICING[lowerType];
    if (!pricingTier) {
      return new Response(JSON.stringify({ error: "Invalid plan type" }), { status: 400, headers: corsHeaders });
    }

    serverExpectedAmount = pricingTier[lowerPlan];
    if (!serverExpectedAmount) {
      return new Response(JSON.stringify({ error: "Invalid plan" }), { status: 400, headers: corsHeaders });
    }
  }

  // 1. Validate Turnstile Token
  const turnstileRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${encodeURIComponent(env.TURNSTILE_SECRET_KEY)}&response=${encodeURIComponent(turnstileToken)}&remoteip=${ip}`
  });
  const turnstileData = await turnstileRes.json();
  if (!turnstileData.success) {
    return new Response(JSON.stringify({ error: "Security validation failed. Refresh page and try again." }), { status: 400, headers: corsHeaders });
  }

  // 2. Double-Spend/Duplicate check via KV
  const kvKey = `tx:${cleanTxHash.toLowerCase()}`;
  const isDuplicate = await env.VERIFIED_TXIDS.get(kvKey);
  if (isDuplicate) {
    return new Response(JSON.stringify({ error: "Transaction hash has already been registered." }), { status: 400, headers: corsHeaders });
  }

  // 3. Verify Blockchain Transaction
  let verificationResult;
  try {
    if (["ethereum", "bnb", "polygon", "base", "arbitrum"].includes(lowerChain)) {
      verificationResult = await verifyEVM(cleanTxHash, lowerChain, upperToken, serverExpectedAmount, env);
    } else if (lowerChain === "solana") {
      verificationResult = await verifySolana(cleanTxHash, upperToken, serverExpectedAmount, env);
    } else if (lowerChain === "tron") {
      verificationResult = await verifyTron(cleanTxHash, upperToken, serverExpectedAmount, env);
    } else {
      return new Response(JSON.stringify({ error: `Unsupported blockchain: ${chain}` }), { status: 400, headers: corsHeaders });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: "Blockchain verification failed", details: err.message }), { status: 400, headers: corsHeaders });
  }

  if (!verificationResult.verified) {
    return new Response(JSON.stringify({ error: verificationResult.reason }), { status: 400, headers: corsHeaders });
  }

  // 4. Save to D1 & store in KV
  const paymentId = generatePaymentId(plan, chain);
  try {
    await env.DB.prepare(
      "INSERT INTO payments (id, plan, payment_type, expected_amount, actual_amount, chain, token, tx_hash, name, email, telegram, project, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'verified')"
    ).bind(
      paymentId,
      plan,
      paymentType,
      serverExpectedAmount,
      verificationResult.actualAmount,
      chain,
      token,
      cleanTxHash,
      name.trim(),
      email.trim(),
      telegram.trim(),
      project.trim()
    ).run();

    // Cache verified transaction hash in KV to prevent double spend
    await env.VERIFIED_TXIDS.put(kvKey, "verified");

    return new Response(JSON.stringify({ success: true, paymentId, actualAmount: verificationResult.actualAmount }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Database registration failure", details: err.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

// ── EVM Verification ──
async function verifyEVM(txHash, chain, token, expectedAmount, env) {
  const rpcUrl = RPC_ENDPOINTS[chain];
  if (!rpcUrl) throw new Error(`RPC endpoint not defined for chain: ${chain}`);

  // Fetch transaction details
  const txRes = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", method: "eth_getTransactionByHash", params: [txHash], id: 1 })
  });
  const txData = await txRes.json();
  if (!txData.result) return { verified: false, reason: "Transaction not found on-chain." };

  const tx = txData.result;

  // Fetch receipt details (verify success state)
  const receiptRes = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", method: "eth_getTransactionReceipt", params: [txHash], id: 1 })
  });
  const receiptData = await receiptRes.json();
  if (!receiptData.result) return { verified: false, reason: "Transaction receipt not available." };

  const receipt = receiptData.result;
  if (receipt.status !== "0x1") return { verified: false, reason: "Transaction failed on-chain." };

  const targetWallet = env.EVM_WALLET.toLowerCase();

  if (token === "ETH" || token === "BNB" || token === "POL") {
    // Native Transfer
    if (!tx.to || tx.to.toLowerCase() !== targetWallet) {
      return { verified: false, reason: "Recipient wallet address mismatch." };
    }
    const valDecimal = parseInt(tx.value, 16) / 1e18;
    if (valDecimal < expectedAmount) {
      return { verified: false, reason: `Insufficient amount. Sent: ${valDecimal}, Expected: ${expectedAmount}` };
    }
    return { verified: true, actualAmount: valDecimal };
  } else if (token === "USDT") {
    // Token Transfer
    const tokenConfig = TOKENS[chain]?.USDT;
    if (!tokenConfig) throw new Error("USDT token configuration missing for chain.");

    if (!tx.to || tx.to.toLowerCase() !== tokenConfig.contract.toLowerCase()) {
      return { verified: false, reason: "Transaction does not interact with the valid USDT contract." };
    }

    const input = tx.input || tx.data;
    if (!input || !input.startsWith("0xa9059cbb")) {
      return { verified: false, reason: "Not a valid token transfer method signature." };
    }

    const toParam = input.substring(10, 74).toLowerCase();
    const amountParam = input.substring(74, 138);

    const cleanWallet = targetWallet.replace("0x", "").padStart(64, "0").toLowerCase();
    if (toParam !== cleanWallet) {
      return { verified: false, reason: "ERC-20 transfer recipient mismatch." };
    }

    const rawAmount = parseInt(amountParam, 16);
    const amountDecimal = rawAmount / Math.pow(10, tokenConfig.decimals);

    if (amountDecimal < expectedAmount) {
      return { verified: false, reason: `Insufficient USDT sent. Sent: ${amountDecimal}, Expected: ${expectedAmount}` };
    }

    return { verified: true, actualAmount: amountDecimal };
  }

  return { verified: false, reason: "Unsupported EVM token selection." };
}

// ── Solana Verification ──
async function verifySolana(txHash, token, expectedAmount, env) {
  const rpcUrl = "https://api.mainnet-beta.solana.com";

  const res = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getTransaction",
      params: [txHash, { encoding: "json", maxSupportedTransactionVersion: 0 }]
    })
  });
  const data = await res.json();
  if (!data.result) return { verified: false, reason: "Transaction not found on Solana." };

  const tx = data.result;
  if (tx.meta?.err) return { verified: false, reason: "Solana transaction failed." };

  const targetWallet = env.SOLANA_WALLET;
  const accounts = tx.transaction.message.accountKeys;
  const walletIndex = accounts.indexOf(targetWallet);

  if (walletIndex === -1) {
    return { verified: false, reason: "Recipient wallet not involved in transaction." };
  }

  if (token === "SOL") {
    // Verify Native SOL transfer
    const preBalance = tx.meta.preBalances[walletIndex];
    const postBalance = tx.meta.postBalances[walletIndex];
    const actualSent = (postBalance - preBalance) / 1e9;

    if (actualSent < expectedAmount) {
      return { verified: false, reason: `Insufficient SOL sent. Sent: ${actualSent}, Expected: ${expectedAmount}` };
    }

    return { verified: true, actualAmount: actualSent };
  } else if (token === "USDT") {
    const usdtMint = "Es9vMFrzaypFoZhqWnEKf3mS71Ebrx6m48eT5HVW47h";

    // Trace Token Balances to find matching owner & mint
    const preBalances = tx.meta.preTokenBalances || [];
    const postBalances = tx.meta.postTokenBalances || [];

    const pre = preBalances.find(b => (b.owner === targetWallet || b.accountIndex === walletIndex) && b.mint === usdtMint);
    const post = postBalances.find(b => (b.owner === targetWallet || b.accountIndex === walletIndex) && b.mint === usdtMint);

    const preAmount = pre ? parseFloat(pre.uiTokenAmount.amount) : 0;
    const postAmount = post ? parseFloat(post.uiTokenAmount.amount) : 0;

    const decimals = post ? post.uiTokenAmount.decimals : 6;
    const actualSent = (postAmount - preAmount) / Math.pow(10, decimals);

    if (actualSent < expectedAmount) {
      return { verified: false, reason: `Insufficient Solana USDT sent. Sent: ${actualSent}, Expected: ${expectedAmount}` };
    }

    return { verified: true, actualAmount: actualSent };
  }

  return { verified: false, reason: "Unsupported Solana token selection." };
}

// ── TRON Verification ──
async function verifyTron(txHash, token, expectedAmount, env) {
  const res = await fetch("https://api.trongrid.io/wallet/gettransactionbyid", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value: txHash })
  });
  const tx = await res.json();
  if (!tx.txID) return { verified: false, reason: "Transaction not found on TRON." };

  if (!tx.ret || tx.ret[0].contractRet !== "SUCCESS") {
    return { verified: false, reason: "TRON transaction failed." };
  }

  const targetWallet = env.TRON_WALLET;
  const targetWalletHex = tronAddressToHex(targetWallet);

  const contract = tx.raw_data.contract[0];
  const type = contract.type;

  if (token === "TRX") {
    if (type !== "TransferContract") {
      return { verified: false, reason: "TRON transaction is not a native TRX transfer." };
    }

    const value = contract.parameter.value;
    if (value.to_address.toLowerCase() !== targetWalletHex) {
      return { verified: false, reason: "Recipient TRON wallet address mismatch." };
    }

    const amountSent = value.amount / 1e6; // 1 TRX = 1e6 Sun
    if (amountSent < expectedAmount) {
      return { verified: false, reason: `Insufficient TRX sent. Sent: ${amountSent}, Expected: ${expectedAmount}` };
    }

    return { verified: true, actualAmount: amountSent };
  } else if (token === "USDT") {
    if (type !== "TriggerSmartContract") {
      return { verified: false, reason: "Transaction is not a TRON TRC-20 interaction." };
    }

    const value = contract.parameter.value;
    const usdtContractHex = "41a614f803b6c4802c66a42ab31d4d15d581a62d3c"; // TR7NHqJEJMxWf8P7bVY8YWkh59r5iC7137
    if (value.contract_address.toLowerCase() !== usdtContractHex) {
      return { verified: false, reason: "Transaction does not interact with the verified TRON USDT contract." };
    }

    const data = value.data;
    if (!data || !data.startsWith("a9059cbb")) {
      return { verified: false, reason: "Not a valid TRC-20 token transfer signature." };
    }

    const toParam = data.substring(8, 72).toLowerCase();
    const amountParam = data.substring(72, 136);

    const payloadHex = targetWalletHex.slice(2).padStart(64, "0").toLowerCase();
    if (toParam !== payloadHex) {
      return { verified: false, reason: "TRC-20 transfer recipient address mismatch." };
    }

    const amountSent = parseInt(amountParam, 16) / 1e6; // TRON USDT has 6 decimals
    if (amountSent < expectedAmount) {
      return { verified: false, reason: `Insufficient TRC-20 USDT sent. Sent: ${amountSent}, Expected: ${expectedAmount}` };
    }

    return { verified: true, actualAmount: amountSent };
  }

  return { verified: false, reason: "Unsupported TRON token selection." };
}

// ── Telegram Discussion Group Auto-Creation Handlers ──

async function handleRegisterTicket(request, env, corsHeaders) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400, headers: corsHeaders });
  }

  const { ticketId, projectName, telegramHandle } = body;
  if (!ticketId) {
    return new Response(JSON.stringify({ error: "Missing ticketId" }), { status: 400, headers: corsHeaders });
  }

  const ticketKey = `ticket:${ticketId.trim().toUpperCase()}`;
  const data = {
    ticketId: ticketId.trim(),
    projectName: (projectName || "Unknown Project").trim(),
    telegramHandle: (telegramHandle || "").trim(),
    timestamp: Date.now()
  };

  try {
    await env.VERIFIED_TXIDS.put(ticketKey, JSON.stringify(data), { expirationTtl: 604800 }); // 7 days TTL
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ error: "KV write failure", details: err.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

async function handleRegisterCreator(request, env, corsHeaders) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400, headers: corsHeaders });
  }

  let { telegramHandle, name } = body;
  if (!telegramHandle) {
    return new Response(JSON.stringify({ error: "Missing telegramHandle" }), { status: 400, headers: corsHeaders });
  }

  let cleanHandle = telegramHandle.trim().replace(/^@/, "");
  if (!cleanHandle) {
    return new Response(JSON.stringify({ error: "Invalid telegramHandle" }), { status: 400, headers: corsHeaders });
  }

  const creatorKey = `creator:${cleanHandle.toLowerCase()}`;
  const data = {
    telegramHandle: cleanHandle,
    name: (name || "Unknown Creator").trim(),
    timestamp: Date.now()
  };

  try {
    await env.VERIFIED_TXIDS.put(creatorKey, JSON.stringify(data), { expirationTtl: 604800 }); // 7 days TTL
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ error: "KV write failure", details: err.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

async function handleTelegramWebhook(request, env, corsHeaders) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_SUPERGROUP_ID) {
    console.error("Telegram credentials missing in Worker environment variables.");
    return new Response(JSON.stringify({ error: "Server Configuration Error" }), { status: 500, headers: corsHeaders });
  }

  let update;
  try {
    update = await request.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid JSON payload" }), { status: 400, headers: corsHeaders });
  }

  const message = update.message;
  if (!message || !message.text) {
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders });
  }

  const chatId = message.chat.id;
  const text = message.text.trim();

  if (text.startsWith("/start")) {
    const parts = text.split(/\s+/);
    if (parts.length > 1) {
      const payload = parts[1];
      
      if (payload.startsWith("inquiry_")) {
        const ticketId = payload.substring("inquiry_".length).toUpperCase();
        const ticketKey = `ticket:${ticketId}`;
        const ticketDataStr = await env.VERIFIED_TXIDS.get(ticketKey);
        
        if (!ticketDataStr) {
          await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, 
            `⚠️ <b>Access Denied</b>\n\nNo active ticket found for <b>${ticketId}</b>. To start a discussion group, please fill out the project inquiry form first:\n\n🌐 https://flexist.in/inquiry\n\nIf you have already submitted the form, please use the button on the success screen.`
          );
          return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders });
        }
        
        const ticketData = JSON.parse(ticketDataStr);
        const topicKey = `topic:inquiry:${ticketId}`;
        const existingTopicStr = await env.VERIFIED_TXIDS.get(topicKey);
        
        if (existingTopicStr) {
          const existingTopic = JSON.parse(existingTopicStr);
          await sendTopicLinks(env.TELEGRAM_BOT_TOKEN, chatId, ticketId, ticketData.projectName, existingTopic.inviteLink, env.TELEGRAM_SUPERGROUP_ID, existingTopic.threadId);
          return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders });
        }
        
        try {
          const topicName = `Inquiry: ${ticketId} (${ticketData.projectName})`;
          const threadId = await createForumTopic(env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_SUPERGROUP_ID, topicName);
          const inviteLink = await createChatInviteLink(env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_SUPERGROUP_ID, `Inquiry ${ticketId}`);
          
          await env.VERIFIED_TXIDS.put(topicKey, JSON.stringify({ threadId, inviteLink }));
          
          const founderAlert = `🔔 <b>New Project Discussion Started</b>\n\n<b>Ticket:</b> ${ticketId}\n<b>Project:</b> ${ticketData.projectName}\n<b>Founder Telegram:</b> ${ticketData.telegramHandle ? '@' + ticketData.telegramHandle.replace(/^@/, "") : 'Not provided'}\n\n<i>Waiting for founder/team to join the thread...</i>`;
          await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_SUPERGROUP_ID, founderAlert, threadId);
          
          await sendTopicLinks(env.TELEGRAM_BOT_TOKEN, chatId, ticketId, ticketData.projectName, inviteLink, env.TELEGRAM_SUPERGROUP_ID, threadId);
        } catch (err) {
          console.error("Error creating Telegram topic/invite:", err);
          await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, 
            `❌ <b>Error</b>\n\nFailed to create discussion group automatically. Please contact us directly at @FlexistCrypto.`
          );
        }
        return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders });
      }
      
      if (payload.startsWith("creator_")) {
        const creatorHandle = payload.substring("creator_".length).toLowerCase().replace(/^@/, "");
        const creatorKey = `creator:${creatorHandle}`;
        const creatorDataStr = await env.VERIFIED_TXIDS.get(creatorKey);
        
        if (!creatorDataStr) {
          await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, 
            `⚠️ <b>Access Denied</b>\n\nWe could not verify your application registration. To start a discussion group, please fill out the influencer application form first:\n\n🌐 https://flexist.in/influencer/signup\n\nIf you have already submitted the form, please use the button on the success screen.`
          );
          return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders });
        }
        
        const creatorData = JSON.parse(creatorDataStr);
        const topicKey = `topic:creator:${creatorHandle}`;
        const existingTopicStr = await env.VERIFIED_TXIDS.get(topicKey);
        
        if (existingTopicStr) {
          const existingTopic = JSON.parse(existingTopicStr);
          await sendTopicLinks(env.TELEGRAM_BOT_TOKEN, chatId, `@${creatorHandle}`, creatorData.name, existingTopic.inviteLink, env.TELEGRAM_SUPERGROUP_ID, existingTopic.threadId);
          return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders });
        }
        
        try {
          const topicName = `Creator: @${creatorHandle} (${creatorData.name})`;
          const threadId = await createForumTopic(env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_SUPERGROUP_ID, topicName);
          const inviteLink = await createChatInviteLink(env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_SUPERGROUP_ID, `Creator @${creatorHandle}`);
          
          await env.VERIFIED_TXIDS.put(topicKey, JSON.stringify({ threadId, inviteLink }));
          
          const founderAlert = `🔔 <b>New Creator Discussion Started</b>\n\n<b>Name:</b> ${creatorData.name}\n<b>Telegram:</b> @${creatorHandle}\n\n<i>Waiting for creator to join the thread...</i>`;
          await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_SUPERGROUP_ID, founderAlert, threadId);
          
          await sendTopicLinks(env.TELEGRAM_BOT_TOKEN, chatId, `@${creatorHandle}`, creatorData.name, inviteLink, env.TELEGRAM_SUPERGROUP_ID, threadId);
        } catch (err) {
          console.error("Error creating Telegram topic/invite for creator:", err);
          await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, 
            `❌ <b>Error</b>\n\nFailed to create discussion group automatically. Please contact us directly at @FlexistCrypto.`
          );
        }
        return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders });
      }
    }
    
    await sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, chatId, 
      `👋 <b>Welcome to Flexist Discussions!</b>\n\nTo automatically create a dedicated group topic for your discussion, please submit one of our forms:\n\n📁 <b>Project Inquiry:</b>\nhttps://flexist.in/inquiry\n\n📣 <b>Influencer/Creator Portal:</b>\nhttps://flexist.in/influencer/signup\n\nOnce completed, click the Telegram option shown on the success page.\n\n<i>Alternatively, you can chat directly with the founder at @FlexistCrypto.</i>`
    );
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders });
}

async function sendTelegramMessage(token, chatId, text, threadId = null) {
  if (!token) return;
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const body = {
    chat_id: chatId,
    text: text,
    parse_mode: "HTML"
  };
  if (threadId) {
    body.message_thread_id = threadId;
  }

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

async function createForumTopic(token, supergroupId, name) {
  const url = `https://api.telegram.org/bot${token}/createForumTopic`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: supergroupId,
      name: name
    })
  });
  const data = await res.json();
  if (!data.ok) {
    throw new Error(data.description || "Failed to create forum topic");
  }
  return data.result.message_thread_id;
}

async function createChatInviteLink(token, supergroupId, name) {
  const url = `https://api.telegram.org/bot${token}/createChatInviteLink`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: supergroupId,
      name: name,
      member_limit: 1
    })
  });
  const data = await res.json();
  if (!data.ok) {
    throw new Error(data.description || "Failed to create chat invite link");
  }
  return data.result.invite_link;
}

async function sendTopicLinks(token, chatId, id, name, inviteLink, supergroupId, threadId) {
  const cleanGroupId = Math.abs(parseInt(supergroupId, 10)).toString().replace(/^100/, "");
  const topicLink = `https://t.me/c/${cleanGroupId}/${threadId}`;

  const messageText = `🚀 <b>Your Discussion Topic is Ready!</b>\n\nWe have created a dedicated discussion thread for <b>${name}</b> (${id}).\n\nFollow these 2 steps to join:\n\n1️⃣ <b>Join our Supergroup:</b>\n👉 <a href="${inviteLink}">Click here to join the group</a>\n\n2️⃣ <b>Enter your discussion thread:</b>\n👉 <a href="${topicLink}">Click here to go directly to your thread</a>\n\n<i>Note: The invite link is valid for 1 join only. Our team has been notified and is looking forward to chatting with you!</i>`;

  await sendTelegramMessage(token, chatId, messageText);
}
