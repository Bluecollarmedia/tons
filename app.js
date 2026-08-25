"use strict";

/* ------------------------------------------------------------------ *
 * Built-in siren / tone definitions.
 * Each is synthesized with the Web Audio API (no audio files needed).
 *
 * type: "sweep"   -> triangle-wave frequency sweep between low/high
 * type: "step"    -> stepped tones (hi-lo / warble / two-tone page style)
 * type: "whoop"   -> short rising blip then a gap, repeated
 * type: "chord"   -> one or more sustained tones mixed together
 *
 * category: "regular"    -> vehicle-style siren tones
 * category: "dispatcher" -> paging / dispatch alert tones
 * ------------------------------------------------------------------ */
const REGULAR_SIRENS = [
  { id: "wail",        name: "Wail",         icon: "🚨", wave: "sine",     type: "sweep", cycle: 3.0,  low: 550,  high: 1200, category: "regular" },
  { id: "airhorn",     name: "Airhorn",      icon: "📯", wave: "sawtooth", type: "chord", freqs: [370, 440], category: "regular" },
  { id: "fast-wail",   name: "Fast Wail",    icon: "🚨", wave: "sine",     type: "sweep", cycle: 1.2,  low: 550,  high: 1200, category: "regular" },
  { id: "slow-wail",   name: "Slow Wail",    icon: "🚨", wave: "sine",     type: "sweep", cycle: 5.0,  low: 500,  high: 1100, category: "regular" },
  { id: "yelp",        name: "Yelp",         icon: "📢", wave: "sine",     type: "sweep", cycle: 0.42, low: 600,  high: 1250, category: "regular" },
  { id: "hi-lo",       name: "Hi-Lo",        icon: "🔀", wave: "square",   type: "step",  cycle: 1.0,  freqs: [500, 650], category: "regular" },
  { id: "priority",    name: "Priority",     icon: "⚠️", wave: "sawtooth", type: "sweep", cycle: 0.5,  low: 800,  high: 1400, category: "regular" },
  { id: "phaser-1",    name: "Phaser 1",     icon: "🌀", wave: "sawtooth", type: "sweep", cycle: 1.6,  low: 400,  high: 1000, category: "regular" },
  { id: "phaser-2",    name: "Phaser 2",     icon: "🌀", wave: "sawtooth", type: "sweep", cycle: 0.8,  low: 400,  high: 1000, category: "regular" },
  { id: "manual",      name: "Manual Wail",  icon: "🎚️", wave: "sine",     type: "sweep", cycle: 4.0,  low: 500,  high: 1050, category: "regular" },
  { id: "howler",      name: "Howler",       icon: "🐺", wave: "square",   type: "step",  cycle: 0.7,  freqs: [220, 400], category: "regular" },
  { id: "rumble",      name: "Rumbler",      icon: "💥", wave: "sawtooth", type: "chord", freqs: [90, 135], pulseRate: 12, category: "regular" },
  { id: "piercer",     name: "Piercer",      icon: "📌", wave: "sine",     type: "sweep", cycle: 0.6,  low: 1000, high: 2000, category: "regular" },
  { id: "warble",      name: "Warble",       icon: "🔊", wave: "triangle", type: "step",  cycle: 0.25, freqs: [700, 1300], category: "regular" },
  { id: "chirp",       name: "Chirp",        icon: "🐦", wave: "sine",     type: "whoop", low: 700,  high: 1500, rise: 0.12, hold: 0.05, gap: 0.35, category: "regular" },
  { id: "scanner",     name: "Scanner",      icon: "📻", wave: "square",   type: "step",  cycle: 0.5,  freqs: [900, 1100, 1300], category: "regular" },
  { id: "klaxon",      name: "Klaxon",       icon: "🛑", wave: "sawtooth", type: "sweep", cycle: 2.2,  low: 300,  high: 900, category: "regular" },
  { id: "foghorn",     name: "Foghorn",      icon: "🌫️", wave: "sine",     type: "chord", freqs: [110], pulseRate: 0.6, category: "regular" },
  { id: "pulse",       name: "Pulse Tone",   icon: "💠", wave: "square",   type: "step",  cycle: 0.3,  freqs: [850, 0], category: "regular" },
  { id: "sweep",       name: "Sweep",        icon: "📈", wave: "triangle", type: "sweep", cycle: 6.0,  low: 400,  high: 1600, category: "regular" },
  { id: "alert",       name: "Alert Tone",   icon: "🔔", wave: "square",   type: "step",  cycle: 1.0,  freqs: [853, 960], category: "regular" },
  { id: "whoop",       name: "Whoop",        icon: "🚀", wave: "sine",     type: "whoop", low: 500,  high: 1400, rise: 0.25, hold: 0.05, gap: 0.6, category: "regular" },
];

const DISPATCH_SIRENS = [
  { id: "d-two-tone",   name: "Two-Tone Page",  icon: "📟", wave: "sine",   type: "step",  cycle: 4.5, freqs: [852, 960, 0], category: "dispatcher" },
  { id: "d-longtone",   name: "Long Tone",       icon: "📶", wave: "sine",   type: "chord", freqs: [1000], category: "dispatcher" },
  { id: "d-triplebeep", name: "Triple Beep",     icon: "🔘", wave: "sine",   type: "step",  cycle: 3.0, freqs: [1500, 0, 1500, 0, 1500, 0, 0, 0, 0, 0], category: "dispatcher" },
  { id: "d-digichirp",  name: "Digital Chirp",   icon: "💬", wave: "sine",   type: "whoop", low: 1400, high: 1800, rise: 0.08, hold: 0.05, gap: 0.5, category: "dispatcher" },
  { id: "d-warble",     name: "Dispatch Warble", icon: "🌊", wave: "triangle", type: "step", cycle: 0.2, freqs: [700, 1000], category: "dispatcher" },
  { id: "d-stationhorn",name: "Station Horn",    icon: "🚒", wave: "square", type: "chord", freqs: [300, 600], pulseRate: 2, category: "dispatcher" },
  { id: "d-hiloage",    name: "High-Low Page",   icon: "📠", wave: "square", type: "step",  cycle: 1.5, freqs: [500, 900], category: "dispatcher" },
  { id: "d-ems",        name: "EMS Dispatch",    icon: "🚑", wave: "sine",   type: "step",  cycle: 5.0, freqs: [750, 1050, 0], category: "dispatcher" },
  { id: "d-allcall",    name: "All-Call Alert",  icon: "📡", wave: "sawtooth", type: "sweep", cycle: 1.0, low: 900, high: 1300, category: "dispatcher" },
];


/* ------------------------------------------------------------------ *
 * Shared waveform math (used for both live playback and offline
 * rendering of a shareable clip).
 * ------------------------------------------------------------------ */
function sirenCurveAt(def, t) {
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

function sirenCycleSeconds(def, speed) {
  if (def.type === "whoop") return (def.rise + def.hold + def.gap) / speed;
  return def.cycle / speed;
}

/* ------------------------------------------------------------------ *
 * Audio engine
 * ------------------------------------------------------------------ */
const MAX_ACTIVE = 3;

class SirenEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.speedMultiplier = 1;
    this.voices = new Map(); // id -> voice
    this.activeOrder = [];   // ids in the order they were started, max MAX_ACTIVE
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

  /** Toggle any built-in tone (sweep/step/whoop/chord) on/off. Enforces the MAX_ACTIVE-voice limit. */
  toggle(def, onChange) {
    const ctx = this.ensureContext();
    if (this.isActive(def.id)) {
      this._stop(def.id);
      onChange();
      return;
    }
    this._makeRoom(onChange);
    const voice = def.type === "chord"
      ? buildChordVoice(ctx, this.master, def)
      : buildSynthVoice(ctx, this.master, def, this.speedMultiplier);
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
    if (this.activeOrder.length >= MAX_ACTIVE) {
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

/* ---- synthesized voice (sweep / step / whoop) --------------------- */

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

  function scheduleCycle(startTime) {
    const dur = sirenCycleSeconds(def, speed);
    const N = 128;
    const freqCurve = new Float32Array(N);
    const gainCurve = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const t = i / N;
      const { freq, gain: g } = sirenCurveAt(def, t);
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
 * Offline rendering -> WAV, for the Share feature.
 * Built-in tones don't exist as files, so we render a few seconds of
 * the tone (always at normal 1x speed) to an actual WAV clip the OS
 * share sheet can hand to WhatsApp (or any other app).
 * ------------------------------------------------------------------ */
const SAMPLE_RATE = 44100;
const clipCache = new Map(); // def.id -> Blob

function shareDurationFor(def) {
  if (def.type === "chord") return 3;
  const cyc = sirenCycleSeconds(def, 1);
  return Math.min(6, Math.max(2, cyc * (def.type === "whoop" ? 3 : 2)));
}

async function renderSirenClip(def) {
  const seconds = shareDurationFor(def);
  const offlineCtx = new OfflineAudioContext(1, Math.ceil(seconds * SAMPLE_RATE), SAMPLE_RATE);

  if (def.type === "chord") {
    const gain = offlineCtx.createGain();
    gain.gain.value = 0;
    gain.connect(offlineCtx.destination);
    const oscs = def.freqs.map((f) => {
      const o = offlineCtx.createOscillator();
      o.type = def.wave;
      o.frequency.value = f;
      o.connect(gain);
      return o;
    });
    oscs.forEach((o) => {
      o.start(0);
      o.stop(seconds);
    });
    gain.gain.setTargetAtTime(1, 0, 0.03);
    if (def.pulseRate && def.pulseRate > 0) {
      const period = 1 / def.pulseRate;
      const N = 32;
      let cursor = 0.03;
      while (cursor < seconds) {
        const dur = Math.min(period, seconds - cursor);
        const curve = new Float32Array(N);
        for (let i = 0; i < N; i++) curve[i] = i / N < 0.5 ? 1 : 0.05;
        gain.gain.setValueCurveAtTime(curve, cursor, dur);
        cursor += period;
      }
    }
  } else {
    const osc = offlineCtx.createOscillator();
    const gain = offlineCtx.createGain();
    osc.type = def.wave;
    gain.gain.value = 0;
    osc.connect(gain);
    gain.connect(offlineCtx.destination);
    osc.start(0);
    osc.stop(seconds);

    const fullCycle = sirenCycleSeconds(def, 1);
    let cursor = 0;
    while (cursor < seconds) {
      const dur = Math.min(fullCycle, seconds - cursor);
      const N = 128;
      const freqCurve = new Float32Array(N);
      const gainCurve = new Float32Array(N);
      for (let i = 0; i < N; i++) {
        const t = (i / N) * (dur / fullCycle);
        const { freq, gain: g } = sirenCurveAt(def, t);
        freqCurve[i] = Math.max(1, freq);
        gainCurve[i] = g;
      }
      osc.frequency.setValueCurveAtTime(freqCurve, cursor, dur);
      gain.gain.setValueCurveAtTime(gainCurve, cursor, dur);
      cursor += dur;
    }
  }

  const rendered = await offlineCtx.startRendering();
  return audioBufferToWav(rendered);
}

function audioBufferToWav(buffer) {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const numFrames = buffer.length;
  const dataSize = numFrames * blockAlign;
  const arrayBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(arrayBuffer);

  const writeString = (offset, str) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  const channels = [];
  for (let c = 0; c < numChannels; c++) channels.push(buffer.getChannelData(c));

  let offset = 44;
  for (let i = 0; i < numFrames; i++) {
    for (let c = 0; c < numChannels; c++) {
      const clamped = Math.max(-1, Math.min(1, channels[c][i]));
      view.setInt16(offset, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}

/* ---- sharing (Web Share API -> native share sheet, WhatsApp included) */

async function shareBlob(blob, filename, title) {
  const file = new File([blob], filename, { type: blob.type });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title });
      return;
    } catch (err) {
      if (err && err.name === "AbortError") return; // user cancelled the share sheet
      // fall through to the download fallback below
    }
  }
  downloadBlob(blob, filename);
  window.alert(`Sharing to apps isn't supported in this browser. "${filename}" was downloaded instead — open WhatsApp and attach it from your files.`);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function slugify(name) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "siren";
}

function extFromMime(type) {
  const m = /audio\/([a-z0-9]+)/i.exec(type || "");
  return m ? m[1] : "audio";
}

async function shareSirenDef(def, shareBtn) {
  const original = shareBtn.textContent;
  shareBtn.disabled = true;
  shareBtn.textContent = "…";
  try {
    let blob = clipCache.get(def.id);
    if (!blob) {
      blob = await renderSirenClip(def);
      clipCache.set(def.id, blob);
    }
    await shareBlob(blob, `${slugify(def.name)}-siren.wav`, `${def.name} siren`);
  } catch (err) {
    console.error(err);
    window.alert("Could not prepare that clip for sharing.");
  } finally {
    shareBtn.disabled = false;
    shareBtn.textContent = original;
  }
}

async function shareCustomSiren(custom, shareBtn) {
  const original = shareBtn.textContent;
  shareBtn.disabled = true;
  shareBtn.textContent = "…";
  try {
    const blob = await fetch(custom.blobUrl).then((r) => r.blob());
    await shareBlob(blob, `${slugify(custom.name)}.${extFromMime(blob.type)}`, custom.name);
  } catch (err) {
    console.error(err);
    window.alert("Could not share that clip.");
  } finally {
    shareBtn.disabled = false;
    shareBtn.textContent = original;
  }
}

/* ---- plain download (no share sheet) ------------------------------ */

async function downloadSirenDef(def, dlBtn) {
  const original = dlBtn.textContent;
  dlBtn.disabled = true;
  dlBtn.textContent = "…";
  try {
    let blob = clipCache.get(def.id);
    if (!blob) {
      blob = await renderSirenClip(def);
      clipCache.set(def.id, blob);
    }
    downloadBlob(blob, `${slugify(def.name)}-siren.wav`);
  } catch (err) {
    console.error(err);
    window.alert("Could not prepare that clip for download.");
  } finally {
    dlBtn.disabled = false;
    dlBtn.textContent = original;
  }
}

async function downloadCustomSiren(custom, dlBtn) {
  const original = dlBtn.textContent;
  dlBtn.disabled = true;
  dlBtn.textContent = "…";
  try {
    const blob = await fetch(custom.blobUrl).then((r) => r.blob());
    downloadBlob(blob, `${slugify(custom.name)}.${extFromMime(blob.type)}`);
  } catch (err) {
    console.error(err);
    window.alert("Could not download that clip.");
  } finally {
    dlBtn.disabled = false;
    dlBtn.textContent = original;
  }
}

/* ------------------------------------------------------------------ *
 * Custom button order (per category), persisted in localStorage so the
 * Reorder panel's changes stick between visits.
 * ------------------------------------------------------------------ */
function getOrderedList(items, storageKey) {
  let stored = [];
  try {
    stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
  } catch {
    stored = [];
  }
  const byId = new Map(items.map((d) => [d.id, d]));
  const ordered = stored.map((id) => byId.get(id)).filter(Boolean);
  const remaining = items.filter((d) => !stored.includes(d.id));
  return [...ordered, ...remaining];
}

function saveOrder(list, storageKey) {
  localStorage.setItem(storageKey, JSON.stringify(list.map((d) => d.id)));
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
const customSection = document.getElementById("customSection");
const customGrid = document.getElementById("customGrid");
const speedToggle = document.getElementById("speedToggle");
const volumeSlider = document.getElementById("volumeSlider");
const stopAllBtn = document.getElementById("stopAll");
const uploadToggle = document.getElementById("uploadToggle");
const uploadForm = document.getElementById("uploadForm");
const uploadCancel = document.getElementById("uploadCancel");
const tabRegular = document.getElementById("tabRegular");
const tabDispatcher = document.getElementById("tabDispatcher");
const reorderToggle = document.getElementById("reorderToggle");
const reorderModal = document.getElementById("reorderModal");
const reorderClose = document.getElementById("reorderClose");
const reorderRegularList = document.getElementById("reorderRegular");
const reorderDispatcherList = document.getElementById("reorderDispatcher");
const reorderCustomList = document.getElementById("reorderCustom");
const reorderCustomGroup = document.getElementById("reorderCustomGroup");

const customSirens = []; // { id, name, blobUrl }
let currentCategory = "regular";

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

function addTileActions(tile, { onShare, onDownload }) {
  const wrap = document.createElement("div");
  wrap.className = "tile-actions";

  const share = document.createElement("button");
  share.className = "share";
  share.type = "button";
  share.title = "Share to WhatsApp";
  share.textContent = "Share";
  share.addEventListener("click", (e) => {
    e.stopPropagation();
    onShare(share);
  });

  const download = document.createElement("button");
  download.className = "download";
  download.type = "button";
  download.title = "Download audio";
  download.textContent = "⬇";
  download.addEventListener("click", (e) => {
    e.stopPropagation();
    onDownload(download);
  });

  wrap.appendChild(share);
  wrap.appendChild(download);
  tile.appendChild(wrap);
}

function renderBuiltIns() {
  grid.innerHTML = "";
  const base = currentCategory === "dispatcher" ? DISPATCH_SIRENS : REGULAR_SIRENS;
  const list = getOrderedList(base, `tons-order-${currentCategory}`);

  for (const def of list) {
    const btn = makeButton(def);
    addTileActions(btn, {
      onShare: (shareBtn) => shareSirenDef(def, shareBtn),
      onDownload: (dlBtn) => downloadSirenDef(def, dlBtn),
    });
    btn.addEventListener("click", () => engine.toggle(def, refreshStates));
    grid.appendChild(btn);
  }

  refreshStates();
}

function renderCustom() {
  customGrid.innerHTML = "";
  customSection.classList.toggle("hidden", customSirens.length === 0);
  const list = getOrderedList(customSirens, "tons-order-custom");

  for (const custom of list) {
    const btn = makeButton({ id: custom.id, name: custom.name, icon: "🎵", sub: "custom" });

    addTileActions(btn, {
      onShare: (shareBtn) => shareCustomSiren(custom, shareBtn),
      onDownload: (dlBtn) => downloadCustomSiren(custom, dlBtn),
    });

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
      renderCustom();
    });
    btn.appendChild(remove);

    btn.addEventListener("click", () => {
      engine.toggleAudio(custom.id, custom.blobUrl, refreshStates);
    });
    customGrid.appendChild(btn);
  }

  refreshStates();
}

function refreshAfterReorder() {
  renderBuiltIns();
  renderCustom();
}

function renderReorderList(ulEl, items, storageKey) {
  const list = getOrderedList(items, storageKey);
  ulEl.innerHTML = "";

  list.forEach((item, idx) => {
    const li = document.createElement("li");
    li.className = "reorder-row";
    li.innerHTML = `
      <span class="reorder-icon">${item.icon || "🎵"}</span>
      <span class="reorder-name">${item.name}</span>
      <span class="reorder-controls">
        <button type="button" class="reorder-btn up" ${idx === 0 ? "disabled" : ""} title="Move up">▲</button>
        <button type="button" class="reorder-btn down" ${idx === list.length - 1 ? "disabled" : ""} title="Move down">▼</button>
      </span>
    `;
    li.querySelector(".up").addEventListener("click", () => {
      if (idx === 0) return;
      [list[idx - 1], list[idx]] = [list[idx], list[idx - 1]];
      saveOrder(list, storageKey);
      renderReorderList(ulEl, items, storageKey);
      refreshAfterReorder();
    });
    li.querySelector(".down").addEventListener("click", () => {
      if (idx === list.length - 1) return;
      [list[idx + 1], list[idx]] = [list[idx], list[idx + 1]];
      saveOrder(list, storageKey);
      renderReorderList(ulEl, items, storageKey);
      refreshAfterReorder();
    });
    ulEl.appendChild(li);
  });
}

function openReorderModal() {
  renderReorderList(reorderRegularList, REGULAR_SIRENS, "tons-order-regular");
  renderReorderList(reorderDispatcherList, DISPATCH_SIRENS, "tons-order-dispatcher");
  reorderCustomGroup.classList.toggle("hidden", customSirens.length === 0);
  renderReorderList(reorderCustomList, customSirens, "tons-order-custom");
  reorderModal.classList.remove("hidden");
}

reorderToggle.addEventListener("click", openReorderModal);
reorderClose.addEventListener("click", () => reorderModal.classList.add("hidden"));
reorderModal.addEventListener("click", (e) => {
  if (e.target === reorderModal) reorderModal.classList.add("hidden");
});

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

function setCategory(cat) {
  currentCategory = cat;
  tabRegular.classList.toggle("active", cat === "regular");
  tabRegular.setAttribute("aria-selected", String(cat === "regular"));
  tabDispatcher.classList.toggle("active", cat === "dispatcher");
  tabDispatcher.setAttribute("aria-selected", String(cat === "dispatcher"));
  renderBuiltIns();
}

tabRegular.addEventListener("click", () => setCategory("regular"));
tabDispatcher.addEventListener("click", () => setCategory("dispatcher"));

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
  renderCustom();
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
  renderCustom();
}

renderBuiltIns();
loadCustomFromDb();
