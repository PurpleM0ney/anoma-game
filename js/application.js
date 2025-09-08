// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
});

// Tooltip injected immediately (no DOMContentLoaded)
(function () {
  const tooltip = document.createElement("div");
  tooltip.id = "tile-tooltip";
  tooltip.style.position = "absolute";
  tooltip.style.background = "#f9f6f2";
  tooltip.style.color = "#776e65";
  tooltip.style.padding = "6px 10px";
  tooltip.style.borderRadius = "6px";
  tooltip.style.boxShadow = "0 0 6px rgba(0,0,0,0.15)";
  tooltip.style.fontSize = "14px";
  tooltip.style.maxWidth = "200px";
  tooltip.style.zIndex = "1000";
  tooltip.style.display = "none";
  tooltip.style.pointerEvents = "none";
  document.body.appendChild(tooltip);

  const tooltipMap = {
    "Input": "Raw data fed into the circuit 🧾",
    "Preproc.": "Transforms raw input for computation ⚙️",
    "Circuit": "Describes the logic to be verified 🔄",
    "Proof": "Compact proof of correct computation 🔐",
    "Verifier": "Validates the proof without redoing work 🕵️‍♂️",
    "zkPipe": "Bundles multiple proofs into one pipeline 📦",
    "zkRollup": "Scales transactions by rolling them up 🚀",
    "zkEVM": "EVM-compatible zero-knowledge environment ⚡",
    "Recursive": "Nests proofs inside proofs — recursion! 🔁",
    "FinalPf.": "Ultimate zk-proof — final checkpoint 🧠",
    "Nexus!": "You've reached the Nexus! 🧬"
  };

  document.addEventListener("mouseover", function(e) {
    if (e.target.classList.contains("tile-inner")) {
      const text = e.target.textContent;
      const tip = tooltipMap[text];
      if (tip) {
        tooltip.textContent = tip;
        tooltip.style.display = "block";
      }
    }
  });

  document.addEventListener("mousemove", function(e) {
    if (tooltip.style.display === "block") {
      tooltip.style.left = e.pageX + 12 + "px";
      tooltip.style.top = e.pageY + 12 + "px";
    }
  });

  document.addEventListener("mouseout", function(e) {
    if (e.target.classList.contains("tile-inner")) {
      tooltip.style.display = "none";
    }
  });

  console.log("✅ Tooltip logic initialized (immediate)");
})();
