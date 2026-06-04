const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json"
};

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

export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const ip = request.headers.get("CF-Connecting-IP") || "127.0.0.1";

    // ── RATE LIMITER (5 attempts per minute per IP via KV) ──
    const minuteBucket = Math.floor(Date.now() / 60000);
    const limitKey = `rate:${ip}:${minuteBucket}`;
    const rateData = await env.VERIFIED_TXIDS.get(limitKey);
    const rateCount = rateData ? parseInt(rateData, 10) : 0;

    if (rateCount >= 5) {
      return new Response(JSON.stringify({ error: "Too many requests. Please try again in a minute." }), {
        status: 429,
        headers: CORS_HEADERS
      });
    }

    await env.VERIFIED_TXIDS.put(limitKey, (rateCount + 1).toString(), { expirationTtl: 60 });

    // ── ROUTER ──
    if (url.pathname === "/verify-payment" && request.method === "POST") {
      return handleVerifyPayment(request, env, ip);
    } else if (url.pathname === "/payment-status" && request.method === "GET") {
      return handlePaymentStatus(url, env);
    }

    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: CORS_HEADERS
    });
  }
};

async function handlePaymentStatus(url, env) {
  const txid = url.searchParams.get("txid");
  if (!txid) {
    return new Response(JSON.stringify({ error: "Missing txid parameter" }), {
      status: 400,
      headers: CORS_HEADERS
    });
  }

  try {
    const { results } = await env.DB.prepare(
      "SELECT id, plan, payment_type, expected_amount, actual_amount, chain, token, tx_hash, name, email, telegram, project, status, created_at FROM payments WHERE tx_hash = ? OR id = ?"
    ).bind(txid, txid).all();

    if (!results || results.length === 0) {
      return new Response(JSON.stringify({ error: "Payment not found" }), {
        status: 404,
        headers: CORS_HEADERS
      });
    }

    return new Response(JSON.stringify({ payment: results[0] }), {
      status: 200,
      headers: CORS_HEADERS
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Database error", details: err.message }), {
      status: 500,
      headers: CORS_HEADERS
    });
  }
}

async function handleVerifyPayment(request, env, ip) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400, headers: CORS_HEADERS });
  }

  const {
    plan,
    paymentType,
    expectedAmount,
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
  if (!plan || !paymentType || !expectedAmount || !chain || !token || !txHash || !name || !email || !telegram || !project || !turnstileToken) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: CORS_HEADERS });
  }

  const cleanTxHash = txHash.trim();
  const lowerChain = chain.toLowerCase();
  const upperToken = token.toUpperCase();
  const lowerPlan = plan.toLowerCase().replace(/\s+/g, "");
  const lowerType = paymentType.toLowerCase();

  // Validate pricing check
  const pricingTier = PLAN_PRICING[lowerType];
  if (!pricingTier || !pricingTier[lowerPlan] || expectedAmount < pricingTier[lowerPlan]) {
    return new Response(JSON.stringify({ error: "Expected amount mismatch or invalid plan pricing configuration" }), { status: 400, headers: CORS_HEADERS });
  }

  // 1. Validate Turnstile Token
  const turnstileRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${encodeURIComponent(env.TURNSTILE_SECRET_KEY)}&response=${encodeURIComponent(turnstileToken)}&remoteip=${ip}`
  });
  const turnstileData = await turnstileRes.json();
  if (!turnstileData.success) {
    return new Response(JSON.stringify({ error: "Security validation failed. Refresh page and try again." }), { status: 400, headers: CORS_HEADERS });
  }

  // 2. Double-Spend/Duplicate check via KV
  const kvKey = `tx:${cleanTxHash.toLowerCase()}`;
  const isDuplicate = await env.VERIFIED_TXIDS.get(kvKey);
  if (isDuplicate) {
    return new Response(JSON.stringify({ error: "Transaction hash has already been registered." }), { status: 400, headers: CORS_HEADERS });
  }

  // 3. Verify Blockchain Transaction
  let verificationResult;
  try {
    if (["ethereum", "bnb", "polygon", "base", "arbitrum"].includes(lowerChain)) {
      verificationResult = await verifyEVM(cleanTxHash, lowerChain, upperToken, expectedAmount, env);
    } else if (lowerChain === "solana") {
      verificationResult = await verifySolana(cleanTxHash, upperToken, expectedAmount, env);
    } else if (lowerChain === "tron") {
      verificationResult = await verifyTron(cleanTxHash, upperToken, expectedAmount, env);
    } else {
      return new Response(JSON.stringify({ error: `Unsupported blockchain: ${chain}` }), { status: 400, headers: CORS_HEADERS });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: "Blockchain verification failed", details: err.message }), { status: 400, headers: CORS_HEADERS });
  }

  if (!verificationResult.verified) {
    return new Response(JSON.stringify({ error: verificationResult.reason }), { status: 400, headers: CORS_HEADERS });
  }

  // 4. Save to D1 & store in KV
  const paymentId = generatePaymentId(plan, chain);
  try {
    await env.DB.prepare(
      "INSERT INTO payments (id, plan, payment_type, expected_amount, actual_amount, chain, token, tx_hash, name, email, telegram, project, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(
      paymentId,
      plan,
      paymentType,
      expectedAmount,
      verificationResult.actualAmount,
      chain,
      token,
      cleanTxHash,
      name,
      email,
      telegram,
      project,
      "verified"
    ).run();

    // Cache verified transaction hash in KV to prevent double spend
    await env.VERIFIED_TXIDS.put(kvKey, "verified");

    return new Response(JSON.stringify({ success: true, paymentId, actualAmount: verificationResult.actualAmount }), {
      status: 200,
      headers: CORS_HEADERS
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Database registration failure", details: err.message }), {
      status: 500,
      headers: CORS_HEADERS
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

  if (token === "SOL") {
    // Verify Native SOL transfer
    const accounts = tx.transaction.message.accountKeys;
    const walletIndex = accounts.indexOf(targetWallet);

    if (walletIndex === -1) {
      return { verified: false, reason: "Recipient wallet not involved in transaction." };
    }

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

    const pre = preBalances.find(b => b.owner === targetWallet && b.mint === usdtMint);
    const post = postBalances.find(b => b.owner === targetWallet && b.mint === usdtMint);

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
