
const logMap = {
  "Intent": [
    "Intent captured from user.",
    "Intent parsed into pipeline.",
    "Intent ready for execution."
  ],
  "Solver": [
    "Solver picked the best route.",
    "Route candidates scored.",
    "Best path selected."
  ],
  "Match": [
    "Matched counterparties for the trade.",
    "Orderflow aligned with intent.",
    "Matching succeeded."
  ],
  "Settle": [
    "Settlement prepared.",
    "Assets balanced for finalization.",
    "Settlement checks passed."
  ],
  "Bundle": [
    "Bundled multiple actions.",
    "Batch created for execution.",
    "Bundle optimized."
  ],
  "Proof": [
    "Zero-knowledge proof generated.",
    "Proof compressed and ready.",
    "Proof verified locally."
  ],
  "Verify": [
    "On-chain verification simulated.",
    "Verifier confirms integrity.",
    "All constraints satisfied."
  ],
  "Anoma": [
    "Routed across networks.",
    "Cross-domain link established.",
    "Anoma handshake complete."
  ],
  "Hyper": [
    "Recursive path expanded.",
    "Nested intents resolved.",
    "Hyper-route stitched."
  ],
  "Final": [
    "Final checkpoint achieved.",
    "All steps sealed.",
    "Ready to claim result."
  ],
  "Anoma!": [
    "Anoma moment reached!",
    "Everything just works.",
    "Welcome to Anoma!"
  ]
};



  const valueMap = {
  2: "Intent",
  4: "Solver",
  8: "Match",
 16: "Settle",
 32: "Bundle",
 64: "Proof",
128: "Verify",
256: "Anoma",
512: "Hyper",
1024: "Final",
2048: "Anoma!"
};

function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");

  this.score = 0;
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false); // You lose
      } else if (metadata.won) {
        self.message(true); // You win!
      }
    }

  });
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continueGame = function () {
  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile", "tile-" + tile.value, positionClass];

  if (tile.value > 2048) classes.push("tile-super");

  this.applyClasses(wrapper, classes);

  inner.classList.add("tile-inner");
  inner.textContent = valueMap[tile.value] || tile.value;

  const logEl = document.getElementById("compiler-log");
  if (tile.mergedFrom && logEl) {
    const label = valueMap[tile.value] || tile.value || "Module";
    const msg = ">> " + label + " merged.";
    const entry = document.createElement("div");

    if (label.toString().toLowerCase().includes("input") || label.toString().toLowerCase().includes("preproc")) {
      entry.className = "log-success";
    } else if (label.toString().toLowerCase().includes("verifier") || label.toString().toLowerCase().includes("zkrollup")) {
      entry.className = "log-warning";
    } else {
      entry.className = "log-info";
    }

    let message = ">> " + label + " merged.";
    if (logMap[label]) {
      const options = logMap[label];
      message = options[Math.floor(Math.random() * options.length)];
    }
    entry.textContent = message;
    logEl.appendChild(entry);

    while (logEl.childNodes.length > 5) {
      logEl.removeChild(logEl.firstChild);
    }
  }


  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);

  var difference = score - this.score;
  this.score = score;

  this.scoreContainer.textContent = this.score;

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;

    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.message = function (won) {
  var type    = won ? "game-won" : "game-over";
  var message = won ? "You win!" : "Game over!";

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};



