"use strict";

/* ------------------------------------------------------------------ *
 * Built-in siren definitions.
 * Each is synthesized with the Web Audio API (no audio files needed).
 *
 * type: "sweep"  -> triangle-wave frequency sweep between low/high
 * type: "step"   -> stepped tones (hi-lo / warble style)
 * type: "whoop"  -> short rising blip then a gap, repeated
 * type: "chord"  -> one or more sustained tones mixed together
 * ------------------------------------------------------------------ */
const SIRENS = [
  { id: "wail",        name: "Wail",         icon: "🚨", wave: "sine",     type: "sweep", cycle: 3.0,  low: 550,  high: 1200 },
  { id: "fast-wail",   name: "Fast Wail",    icon: "🚨", wave: "sine",     type: "sweep", cycle: 1.2,  low: 550,  high: 1200 },
  { id: "slow-wail",   name: "Slow Wail",    icon: "🚨", wave: "sine",     type: "sweep", cycle: 5.0,  low: 500,  high: 1100 },
  { id: "yelp",        name: "Yelp",         icon: "📢", wave: "sine",     type: "sweep", cycle: 0.42, low: 600,  high: 1250 },
  { id: "hi-lo",       name: "Hi-Lo",        icon: "🔀", wave: "square",   type: "step",  cycle: 1.0,  freqs: [500, 650] },
  { id: "priority",    name: "Priority",     icon: "⚠️", wave: "sawtooth", type: "sweep", cycle: 0.5,  low: 800,  high: 1400 },
  { id: "phaser-1",    name: "Phaser 1",     icon: "🌀", wave: "sawtooth", type: "sweep", cycle: 1.6,  low: 400,  high: 1000 },
  { id: "phaser-2",    name: "Phaser 2",     icon: "🌀", wave: "sawtooth", type: "sweep", cycle: 0.8,  low: 400,  high: 1000 },
  { id: "manual",      name: "Manual Wail",  icon: "🎚️", wave: "sine",     type: "sweep", cycle: 4.0,  low: 500,  high: 1050 },
  { id: "airhorn",     name: "Airhorn",      icon: "📯", wave: "sawtooth", type: "chord", freqs: [370, 440] },
  { id: "howler",      name: "Howler",       icon: "🐺", wave: "square",   type: "step",  cycle: 0.7,  freqs: [220, 400] },
  { id: "rumble",      name: "Rumbler",      icon: "💥", wave: "sawtooth", type: "chord", freqs: [90, 135], pulseRate: 12 },
  { id: "piercer",     name: "Piercer",      icon: "📌", wave: "sine",     type: "sweep", cycle: 0.6,  low: 1000, high: 2000 },
  { id: "warble",      name: "Warble",       icon: "🔊", wave: "triangle", type: "step",  cycle: 0.25, freqs: [700, 1300] },
  { id: "chirp",       name: "Chirp",        icon: "🐦", wave: "sine",     type: "whoop", low: 700,  high: 1500, rise: 0.12, hold: 0.05, gap: 0.35 },
  { id: "scanner",     name: "Scanner",      icon: "📻", wave: "square",   type: "step",  cycle: 0.5,  freqs: [900, 1100, 1300] },
  { id: "klaxon",      name: "Klaxon",       icon: "🛑", wave: "sawtooth", type: "sweep", cycle: 2.2,  low: 300,  high: 900 },
  { id: "foghorn",     name: "Foghorn",      icon: "🌫️", wave: "sine",     type: "chord", freqs: [110], pulseRate: 0.6 },
  { id: "pulse",       name: "Pulse Tone",   icon: "💠", wave: "square",   type: "step",  cycle: 0.3,  freqs: [850, 0] },
  { id: "sweep",       name: "Sweep",        icon: "📈", wave: "triangle", type: "sweep", cycle: 6.0,  low: 400,  high: 1600 },
  { id: "alert",       name: "Alert Tone",   icon: "🔔", wave: "square",   type: "step",  cycle: 1.0,  freqs: [853, 960] },
  { id: "whoop",       name: "Whoop",        icon: "🚀", wave: "sine",     type: "whoop", low: 500,  high: 1400, rise: 0.25, hold: 0.05, gap: 0.6 },
];

/* ------------------------------------------------------------------ *
 * Audio engine
 * ------------------------------------------------------------------ */
class SirenEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.speedMultiplier = 1;
    this.voices = new Map(); // id -> voice
    this.activeOrder = [];   // ids in the order they were started, max 2
  }

  ensureContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.8;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }

  setVolume(v) {
    if (this.master) this.master.gain.setTargetAtTime(v, this.ctx.currentTime, 0.05);
  }

  setSpeed(mult) {
    this.speedMultiplier = mult;
    for (const voice of this.voices.values()) {
      if (voice.setSpeed) voice.setSpeed(mult);
    }
  }

  isActive(id) {
    return this.activeOrder.includes(id);
  }

  /** Toggle a built-in synthesized siren on/off. Enforces the 2-voice limit. */
  toggleSynth(def, onChange) {
    const ctx = this.ensureContext();
    if (this.isActive(def.id)) {
      this._stop(def.id);
      onChange();
      return;
    }
    this._makeRoom(onChange);
    const voice = buildSynthVoice(ctx, this.master, def, this.speedMultiplier);
    voice.start();
    this.voices.set(def.id, voice);
    this.activeOrder.push(def.id);
    onChange();
  }

  /** Toggle a custom uploaded audio siren on/off. */
  toggleAudio(id, blobUrl, onChange) {
    const ctx = this.ensureContext();
    if (this.isActive(id)) {
      this._stop(id);
      onChange();
      return;
    }
    this._makeRoom(onChange);
    const voice = buildAudioVoice(ctx, this.master, blobUrl, this.speedMultiplier);
    voice.start();
    this.voices.set(id, voice);
    this.activeOrder.push(id);
    onChange();
  }

  _makeRoom(onChange) {
    if (this.activeOrder.length >= 2) {
      const oldest = this.activeOrder[0];
      this._stop(oldest);
      if (onChange) onChange();
    }
  }

  _stop(id) {
    const voice = this.voices.get(id);
    if (voice) voice.stop();
    this.voices.delete(id);
    this.activeOrder = this.activeOrder.filter((x) => x !== id);
  }

  stopAll(onChange) {
    for (const id of [...this.activeOrder]) this._stop(id);
    onChange();
  }
}

/* ---- synthesized voice ------------------------------------------- */

function buildSynthVoice(ctx, destination, def, initialSpeed) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = def.wave;
  gain.gain.value = 0;
  osc.connect(gain);
  gain.connect(destination);

  let speed = initialSpeed;
  let schedulerHandle = null;
  let cursor = 0;
  const lookahead = 0.25; // seconds
  const tickMs = 80;

  function curveFor(t) {
    switch (def.type) {
      case "sweep": {
        const tri = t < 0.5 ? t / 0.5 : 1 - (t - 0.5) / 0.5;
        return { freq: def.low + (def.high - def.low) * tri, gain: 1 };
      }
      case "step": {
        const n = def.freqs.length;
        const idx = Math.min(n - 1, Math.floor(t * n));
        const f = def.freqs[idx];
        return { freq: f > 0 ? f : def.freqs.find((x) => x > 0) || 440, gain: f > 0 ? 1 : 0 };
      }
      case "whoop": {
        const total = def.rise + def.hold + def.gap;
        const rt = t * total;
        if (rt < def.rise) return { freq: def.low + (def.high - def.low) * (rt / def.rise), gain: 1 };
        if (rt < def.rise + def.hold) return { freq: def.high, gain: 1 };
        return { freq: def.low, gain: 0 };
      }
      default:
        return { freq: def.low || 440, gain: 1 };
    }
  }

  function cycleSeconds() {
    if (def.type === "whoop") return (def.rise + def.hold + def.gap) / speed;
    return def.cycle / speed;
  }

  function scheduleCycle(startTime) {
    const dur = cycleSeconds();
    const N = 128;
    const freqCurve = new Float32Array(N);
    const gainCurve = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const t = i / N;
      const { freq, gain: g } = curveFor(t);
      freqCurve[i] = Math.max(1, freq);
      gainCurve[i] = g;
    }
    osc.frequency.setValueCurveAtTime(freqCurve, startTime, dur);
    gain.gain.setValueCurveAtTime(gainCurve, startTime, dur);
    return dur;
  }

  function schedulerTick() {
    const now = ctx.currentTime;
    while (cursor < now + lookahead) {
      const dur = scheduleCycle(cursor);
      cursor += dur;
    }
  }

  return {
    start() {
      osc.start();
      cursor = ctx.currentTime + 0.02;
      schedulerTick();
      schedulerHandle = setInterval(schedulerTick, tickMs);
    },
    stop() {
      clearInterval(schedulerHandle);
      const now = ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setTargetAtTime(0, now, 0.03);
      osc.stop(now + 0.1);
    },
    setSpeed(mult) {
      speed = mult;
    },
  };
}

/* ---- chord voice (sustained tone(s), optionally pulsed) ---------- */

function buildChordVoice(ctx, destination, def) {
  const gain = ctx.createGain();
  gain.gain.value = 0;
  gain.connect(destination);
  const oscs = def.freqs.map((f) => {
    const o = ctx.createOscillator();
    o.type = def.wave;
    o.frequency.value = f;
    o.connect(gain);
    return o;
  });

  let pulseHandle = null;

  return {
    start() {
      oscs.forEach((o) => o.start());
      const now = ctx.currentTime;
      gain.gain.setTargetAtTime(1, now, 0.05);
      if (def.pulseRate && def.pulseRate > 0) {
        const period = 1 / def.pulseRate;
        let cursor = now + 0.05;
        const N = 32;
        const schedule = () => {
          const t = ctx.currentTime;
          while (cursor < t + 0.25) {
            const curve = new Float32Array(N);
            for (let i = 0; i < N; i++) {
              const frac = i / N;
              curve[i] = frac < 0.5 ? 1 : 0.05;
            }
            gain.gain.setValueCurveAtTime(curve, cursor, period);
            cursor += period;
          }
        };
        schedule();
        pulseHandle = setInterval(schedule, 80);
      }
    },
    stop() {
      if (pulseHandle) clearInterval(pulseHandle);
      const now = ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setTargetAtTime(0, now, 0.05);
      oscs.forEach((o) => o.stop(now + 0.15));
    },
    setSpeed() {
      /* chords are not sped up */
    },
  };
}

/* ---- uploaded audio file voice ------------------------------------ */

function buildAudioVoice(ctx, destination, blobUrl, initialSpeed) {
  const audio = new Audio(blobUrl);
  audio.loop = true;
  audio.playbackRate = initialSpeed;
  const source = ctx.createMediaElementSource(audio);
  const gain = ctx.createGain();
  source.connect(gain);
  gain.connect(destination);

  return {
    start() {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    },
    stop() {
      audio.pause();
    },
    setSpeed(mult) {
      audio.playbackRate = mult;
    },
  };
}

/* ------------------------------------------------------------------ *
 * Storage for custom uploaded sirens (IndexedDB)
 * ------------------------------------------------------------------ */
const DB_NAME = "siren-board";
const STORE = "custom-sirens";

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE, { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function dbGetAll() {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function dbPut(record) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(record);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function dbDelete(id) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/* ------------------------------------------------------------------ *
 * UI wiring
 * ------------------------------------------------------------------ */
const engine = new SirenEngine();
const grid = document.getElementById("grid");
const speedToggle = document.getElementById("speedToggle");
const volumeSlider = document.getElementById("volumeSlider");
const stopAllBtn = document.getElementById("stopAll");
const uploadToggle = document.getElementById("uploadToggle");
const uploadForm = document.getElementById("uploadForm");
const uploadCancel = document.getElementById("uploadCancel");

const customSirens = []; // { id, name, blobUrl }

function makeButton({ id, name, icon, sub }) {
  const btn = document.createElement("button");
  btn.className = "siren-btn";
  btn.type = "button";
  btn.dataset.id = id;
  const idleLabel = sub || "tap to play";
  btn.innerHTML = `
    <span class="icon">${icon || "🔊"}</span>
    <span class="name">${name}</span>
    <span class="sub">${idleLabel}</span>
  `;
  btn.querySelector(".sub").dataset.idle = idleLabel;
  return btn;
}

function renderAll() {
  grid.innerHTML = "";

  for (const def of SIRENS) {
    const btn = makeButton(def);
    btn.addEventListener("click", () => {
      if (def.type === "chord") {
        toggleChord(def);
      } else {
        engine.toggleSynth(def, refreshStates);
      }
    });
    grid.appendChild(btn);
  }

  for (const custom of customSirens) {
    const btn = makeButton({ id: custom.id, name: custom.name, icon: "🎵", sub: "custom" });
    const remove = document.createElement("button");
    remove.className = "remove";
    remove.type = "button";
    remove.textContent = "✕";
    remove.title = "Remove";
    remove.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (engine.isActive(custom.id)) engine.stopAll(refreshStates);
      await dbDelete(custom.id);
      const idx = customSirens.findIndex((c) => c.id === custom.id);
      if (idx >= 0) customSirens.splice(idx, 1);
      renderAll();
    });
    btn.appendChild(remove);
    btn.addEventListener("click", () => {
      engine.toggleAudio(custom.id, custom.blobUrl, refreshStates);
    });
    grid.appendChild(btn);
  }

  refreshStates();
}

// chord-type sirens (airhorn, foghorn, rumbler) use a slightly different
// voice builder, so route them through a small wrapper that still respects
// the engine's shared 2-voice limit and active-state tracking.
const chordVoices = new Map();
function toggleChord(def) {
  const ctx = engine.ensureContext();
  if (engine.isActive(def.id)) {
    engine._stop(def.id);
    refreshStates();
    return;
  }
  engine._makeRoom(refreshStates);
  const voice = buildChordVoice(ctx, engine.master, def);
  voice.start();
  engine.voices.set(def.id, voice);
  engine.activeOrder.push(def.id);
  refreshStates();
}

function refreshStates() {
  document.querySelectorAll(".siren-btn").forEach((btn) => {
    const active = engine.isActive(btn.dataset.id);
    btn.classList.toggle("active", active);
    const sub = btn.querySelector(".sub");
    if (sub) {
      sub.textContent = active ? "playing…" : sub.dataset.idle;
    }
  });
}

speedToggle.addEventListener("click", () => {
  const pressed = speedToggle.getAttribute("aria-pressed") === "true";
  const next = !pressed;
  speedToggle.setAttribute("aria-pressed", String(next));
  engine.setSpeed(next ? 2 : 1);
});

volumeSlider.addEventListener("input", () => {
  engine.ensureContext();
  engine.setVolume(Number(volumeSlider.value) / 100);
});

stopAllBtn.addEventListener("click", () => engine.stopAll(refreshStates));

uploadToggle.addEventListener("click", () => {
  uploadForm.classList.toggle("hidden");
});
uploadCancel.addEventListener("click", () => {
  uploadForm.classList.add("hidden");
  uploadForm.reset();
});

uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nameInput = document.getElementById("sirenName");
  const fileInput = document.getElementById("sirenFile");
  const file = fileInput.files[0];
  if (!file) return;

  const id = "custom-" + Date.now();
  const arrayBuffer = await file.arrayBuffer();
  await dbPut({ id, name: nameInput.value.trim() || "Custom Siren", type: file.type, data: arrayBuffer });

  const blobUrl = URL.createObjectURL(new Blob([arrayBuffer], { type: file.type }));
  customSirens.push({ id, name: nameInput.value.trim() || "Custom Siren", blobUrl });

  uploadForm.reset();
  uploadForm.classList.add("hidden");
  renderAll();
});

async function loadCustomFromDb() {
  try {
    const records = await dbGetAll();
    for (const rec of records) {
      const blobUrl = URL.createObjectURL(new Blob([rec.data], { type: rec.type }));
      customSirens.push({ id: rec.id, name: rec.name, blobUrl });
    }
  } catch (err) {
    console.warn("Could not load custom sirens:", err);
  }
  renderAll();
}

loadCustomFromDb();
