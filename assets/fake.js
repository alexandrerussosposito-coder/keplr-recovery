/* Somente para teste: ?fake=1 instala duas carteiras EIP-6963 falsas e intercepta o RPC.
   ?fake=1&auto=1 conecta a primeira e roda approve+consolidate automaticamente. */
(() => {
  if (!location.search.includes("fake")) return;

  const CONTA = "0x00000398232e2064f896018496b4b44b3d62751f";
  const BASE_USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
  const ETH_USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const SEMGAS = location.search.includes("semgas");
  window.__fakeTxs = [];

  const RPC_HOSTS = ["publicnode.com", "drpc.org"];
  const fetchReal = window.fetch.bind(window);
  window.fetch = async (url, opts) => {
    const u = typeof url === "string" ? url : url.url;
    if (!RPC_HOSTS.some((h) => u.includes(h)) || !opts || !opts.body) return fetchReal(url, opts);
    let req; try { req = JSON.parse(opts.body); } catch { return fetchReal(url, opts); }
    const resp = (result) => new Response(JSON.stringify({ jsonrpc: "2.0", id: req.id, result }), { headers: { "content-type": "application/json" } });
    const emBase = u.includes("base-rpc");
    if (req.method === "eth_getBalance") return resp(!SEMGAS && emBase ? "0xb1a2bc2ec50000" : "0x0"); // 0.05 ETH so em Base
    if (req.method === "eth_gasPrice") return resp("0x3b9aca00");
    if (req.method === "eth_call") {
      const to = (req.params[0].to || "").toLowerCase();
      if (to === BASE_USDC.toLowerCase() || (SEMGAS && to === ETH_USDC.toLowerCase())) return resp("0x" + (2500000).toString(16).padStart(64, "0"));
      return resp("0x0");
    }
    return resp("0x0");
  };

  const prov = (nome) => ({
    isMetaMask: nome === "MetaMask",
    _nome: nome,
    async request({ method, params }) {
      if (method === "eth_requestAccounts") return [CONTA];
      if (method === "eth_accounts") return [CONTA];
      if (method === "eth_chainId") return "0x1";
      if (method === "wallet_switchEthereumChain" || method === "wallet_addEthereumChain") return null;
      if (method === "eth_sendTransaction") {
        const tx = params[0];
        window.__fakeTxs.push(tx);
        const hash = "0x" + String(window.__fakeTxs.length).padStart(64, "0");
        return hash;
      }
      return null;
    },
    on() {},
  });

  const anunciar = (nome) => {
    const info = { uuid: "fake-" + nome, name: nome, icon: null, rdns: "test." + nome.toLowerCase() };
    window.dispatchEvent(new CustomEvent("eip6963:announceProvider", { detail: { info, provider: prov(nome) } }));
  };
  const anunciarTodas = () => { anunciar("MetaMask"); anunciar("Keplr"); };
  window.addEventListener("eip6963:requestProvider", anunciarTodas);
  setTimeout(anunciarTodas, 0);

  if (location.search.includes("pick")) {
    setTimeout(() => document.getElementById("connect").click(), 800);
  }

  if (location.search.includes("auto")) {
    setTimeout(() => {
      document.getElementById("connect").click();
      setTimeout(() => {
        const primeiro = document.querySelector("#wallets .wallet");
        if (primeiro) primeiro.click();
        setTimeout(() => {
          document.getElementById("approve").click();
          setTimeout(() => document.getElementById("sweep").click(), 2500);
        }, 1500);
      }, 500);
    }, 800);
  }
})();
