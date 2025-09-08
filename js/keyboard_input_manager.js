function KeyboardInputManager() {
  this.events = {};

  if (window.navigator.msPointerEnabled) {
    //Internet Explorer 10 style
    this.eventTouchstart    = "MSPointerDown";
    this.eventTouchmove     = "MSPointerMove";
    this.eventTouchend      = "MSPointerUp";
  } else {
    this.eventTouchstart    = "touchstart";
    this.eventTouchmove     = "touchmove";
    this.eventTouchend      = "touchend";
  }

  this.listen();
}

KeyboardInputManager.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

KeyboardInputManager.prototype.emit = function (event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  }
};

KeyboardInputManager.prototype.listen = function () {
  var self = this;

  var map = {
    38: 0, // Up
    39: 1, // Right
    40: 2, // Down
    37: 3, // Left
    75: 0, // Vim up
    76: 1, // Vim right
    74: 2, // Vim down
    72: 3, // Vim left
    87: 0, // W
    68: 1, // D
    83: 2, // S
    65: 3  // A
  };

  // Respond to direction keys
  document.addEventListener("keydown", function (event) {
    var modifiers = event.altKey || event.ctrlKey || event.metaKey ||
                    event.shiftKey;
    var mapped    = map[event.which];

    if (!modifiers) {
      if (mapped !== undefined) {
        event.preventDefault();
        self.emit("move", mapped);
      }
    }

    // R key restarts the game
    if (!modifiers && event.which === 82) {
      self.restart.call(self, event);
    }
  });

  // Respond to button presses
  this.bindButtonPress(".retry-button", this.restart);
  this.bindButtonPress(".restart-button", this.restart);
  this.bindButtonPress(".keep-playing-button", this.keepPlaying);

  // Respond to swipe events
  var touchStartClientX, touchStartClientY;
  var gameContainer = document.getElementsByClassName("game-container")[0];

  gameContainer.addEventListener(this.eventTouchstart, function (event) {
    if ((!window.navigator.msPointerEnabled && event.touches.length > 1) ||
        event.targetTouches.length > 1) {
      return; // Ignore if touching with more than 1 finger
    }

    if (window.navigator.msPointerEnabled) {
      touchStartClientX = event.pageX;
      touchStartClientY = event.pageY;
    } else {
      touchStartClientX = event.touches[0].clientX;
      touchStartClientY = event.touches[0].clientY;
    }

    event.preventDefault();
  });

  gameContainer.addEventListener(this.eventTouchmove, function (event) {
    event.preventDefault();
  });

  gameContainer.addEventListener(this.eventTouchend, function (event) {
    if ((!window.navigator.msPointerEnabled && event.touches.length > 0) ||
        event.targetTouches.length > 0) {
      return; // Ignore if still touching with one or more fingers
    }

    var touchEndClientX, touchEndClientY;

    if (window.navigator.msPointerEnabled) {
      touchEndClientX = event.pageX;
      touchEndClientY = event.pageY;
    } else {
      touchEndClientX = event.changedTouches[0].clientX;
      touchEndClientY = event.changedTouches[0].clientY;
    }

    var dx = touchEndClientX - touchStartClientX;
    var absDx = Math.abs(dx);

    var dy = touchEndClientY - touchStartClientY;
    var absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) > 10) {
      // (right : left) : (down : up)
      self.emit("move", absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0));
    }
  });
};

KeyboardInputManager.prototype.restart = function (event) {
  event.preventDefault();
  this.emit("restart");
};

KeyboardInputManager.prototype.keepPlaying = function (event) {
  event.preventDefault();
  this.emit("keepPlaying");
};

KeyboardInputManager.prototype.bindButtonPress = function (selector, fn) {
  var button = document.querySelector(selector);
  button.addEventListener("click", fn.bind(this));
  button.addEventListener(this.eventTouchend, fn.bind(this));
};


// === Intent input handler (non-invasive): direct emit to GameManager ===
(function(){
  document.addEventListener("DOMContentLoaded", function(){
    var intentEl = document.getElementById("intent-input");
    if (!intentEl) return;
    var logEl = document.getElementById("intent-log");

    var successMessages = [
      "Intent accepted. Solver engaged.",
      "ComposedTx executed successfully.",
      "Privacy preserved via MASP.",
      "Consensus finalized. Upward.",
      "Shrimpers 🦐 aligned with the DAG."
    ];
    var errorMessages = [
      "Intent rejected: malformed command.",
      "No route: solver couldn't parse your intent.",
      "Invalid intent schema. Try: move left/right/up/down.",
      "Bridge down: command not recognized.",
      "Gas spent on nothing. Recompose your intent."
    ];

    var __succIdx = 0, __errIdx = 0;
    function nextSuccessMsg(){ var m = successMessages[__succIdx % successMessages.length]; __succIdx++; return m; }
    function nextErrorMsg(){ var m = errorMessages[__errIdx % errorMessages.length]; __errIdx++; return m; }

    function parseDirIndex(text){
      if (!text) return null;
      text = text.toLowerCase().trim();
      // mapping: 0 up, 1 right, 2 down, 3 left
      if (/[←]|left|shrimp|🦐/.test(text)) return 3;
      if (/[→]|right/.test(text)) return 1;
      if (/[↑]|up|pump|moon|to the moon|bull/.test(text)) return 0;
      if (/[↓]|down|dump|bear|rekt/.test(text)) return 2;
      // also accept last word
      var last = text.split(/\s+/).pop();
      if (last === "left") return 3;
      if (last === "right") return 1;
      if (last === "up") return 0;
      if (last === "down") return 2;
      return null;
    }

    // While typing: stop game hotkeys, but allow normal typing
    document.addEventListener("keydown", function(e){
  if (document.activeElement === intentEl) {
    // allow Enter to reach the input handler; block other hotkeys while typing
    if (e.key !== "Enter") {
      e.stopImmediatePropagation();
    }
  }
}, true);


    intentEl.addEventListener("keydown", function(e){
      if (e.key === "Enter"){
        e.preventDefault();
        var cmd = intentEl.value;
        intentEl.value = "";

        // Restart keywords
        if (/\b(new\s*game|restart|reset)\b/i.test(cmd) && window.ANOMA_GAME && window.ANOMA_GAME.inputManager){
          window.ANOMA_GAME.inputManager.emit("restart");
          if (logEl){
            logEl.textContent = "New game started.";
            logEl.classList.remove("error");
            logEl.classList.add("success","show");
          }
        } else {
          // Movement intent
          var dir = parseDirIndex(cmd);
          if (dir !== null && window.ANOMA_GAME && window.ANOMA_GAME.inputManager){
            window.ANOMA_GAME.inputManager.emit("move", dir);
            if (logEl){
              var idx = Math.floor(Math.random() * successMessages.length);
              var msg = successMessages[idx];
              logEl.textContent = msg;
              logEl.classList.remove("error");
              logEl.classList.add("success","show");
            }
          } else {
            if (logEl){
              var em = nextErrorMsg();
              logEl.textContent = em;
              logEl.classList.remove("success");
              logEl.classList.add("error","show");
            }
          }
        }
        e.stopPropagation();
      }
    });

  });
})();