function addToLoaderLog(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  while (loader.children.length >= 2) {
    loader.removeChild(loader.firstChild);
  }
  loader.appendChild(div.firstChild);
}


document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const loader = document.createElement("div");
  loader.id = "loader";

  loader.innerHTML = `
    <div id="soft-terminal-window">
      <div id="soft-terminal-header">
        <div class="btn red"></div>
        <div class="btn yellow"></div>
        <div class="btn green"></div>
        <span class="terminal-title">Anoma Intent Loader</span>
      </div>
      <div id="soft-terminal-body" class="terminal-text"></div>
    </div>
  `;
  body.appendChild(loader);

  const lines = [
  "Waking up Intent Gossip Layer...",
  "Indexing composable intents...",
  "Shrimpers NFT registry validated 🦐",
  "Solver agents connected to meshnet.",
  "MASP shielded pool checkpointing...",
  "Instantiating ZK context modules...",
  "Bootstrapping Validity Layer nodes...",
  "ComposedTx graph stitched successfully.",
  "DAG ordering intents by dependency...",
  "Upward signal received ↗️",
  "Synchronizing with Anoma DAG...",
  "Generating zero-knowledge proofs...",
  "Solver auction in progress...",
  "Commitment finalized with ZK proofs.",
  "Anoma Intent Loader ready 🌀"
];

  let index = 0;
  const terminalBody = document.getElementById("soft-terminal-body");

  const printLine = () => {
    if (index < lines.length) {
      const line = document.createElement("div");
      line.textContent = lines[index++];
      terminalBody.appendChild(line);
      setTimeout(printLine, 200);
    } else {
      setTimeout(() => {
        loader.remove();
        window.startGame();
      }, 300);
    }
  };

  window.startGame = () => {
    const script = document.createElement("script");
    script.src = "js/application.js";
    document.body.appendChild(script);
  };

  printLine();
});
