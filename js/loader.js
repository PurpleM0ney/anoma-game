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
        <span class="terminal-title">Nexus Composer Loader</span>
      </div>
      <div id="soft-terminal-body" class="terminal-text"></div>
    </div>
  `;
  body.appendChild(loader);

  const lines = [
    "Booting secure enclave...",
    "Spawning modular instances...",
    "Calibrating proof generator...",
    "Hashing verification keys...",
    "Deploying zk-snark adapter...",
    "Compiling constraint system...",
    "Mapping trusted setup...",
    "Injecting sequencer delays...",
    "Encrypting state channels...",
    "Activating L2 bridge...",
    "Loading WASM circuits...",
    "Syncing node graph...",
    "Connecting to NexusNet...",
    "Initializing tx bundler...",
    "Querying Merkle root...",
    "Generating zero-knowledge proof...",
    "Optimizing modular routing...",
    "Running SP1 integrity checks...",
    "Finalizing block commitment...",
    "Ready for Nexus2048"
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
