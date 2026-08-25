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
  { id: "rumble",      name: "Rumbler",      icon: "💥", wave: "sine",     type: "chord", freqs: [55, 82], pulseRate: 8, category: "regular" },
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
 * iOS plays web audio under the "ambient" session category by default,
 * which respects the hardware silent switch — so with the ringer off,
 * nothing is heard at all. There's no official web API to change that
 * category, but a muted, looping <video> kept playing in the background
 * nudges Safari into a session category that ignores the switch. This is
 * an unofficial, long-standing community workaround, not a guarantee —
 * behavior can vary by iOS version. Called once, the first time the
 * AudioContext is created (same user gesture).
 * ------------------------------------------------------------------ */
function unlockIOSAudioSession() {
  const video = document.getElementById("unlockVideo");
  if (video) video.play().catch(() => {});
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
      unlockIOSAudioSession();
    }
    return this.ctx;
  }

  // Actually waits for the context to be running before returning. Firing
  // resume() without awaiting it (the previous behavior) let playback get
  // scheduled against a still-suspended context's frozen clock — the main
  // cause of "sometimes nothing plays," especially on iOS after the tab
  // was backgrounded or the phone was locked (which can also leave the
  // context "interrupted", not just "suspended" — checked for here too).
  async ensureRunning() {
    const ctx = this.ensureContext();
    if (ctx.state !== "running") {
      try {
        await ctx.resume();
      } catch {
        // Some browsers reject resume() calls outside a fresh user-gesture
        // window; scheduling below still works once the context catches up.
      }
    }
    return ctx;
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

  /**
   * Tap a built-in tone (sweep/step/whoop/chord): if it's already playing,
   * retrigger it from the beginning (like rapid-tapping a real siren box)
   * instead of stopping it. If it's off, start it, enforcing MAX_ACTIVE.
   */
  async trigger(def, onChange) {
    const ctx = await this.ensureRunning();
    if (this.isActive(def.id)) {
      const voice = this.voices.get(def.id);
      if (voice && voice.restart) voice.restart();
      onChange();
      return;
    }
    this._makeRoom(onChange);
    const voice = def.type === "chord"
      ? buildChordVoice(ctx, this.master, def, this.speedMultiplier)
      : buildSynthVoice(ctx, this.master, def, this.speedMultiplier);
    voice.start();
    this.voices.set(def.id, voice);
    this.activeOrder.push(def.id);
    onChange();
  }

  /** Same as trigger(), for a custom uploaded audio siren. */
  async triggerAudio(id, blobUrl, onChange) {
    const ctx = await this.ensureRunning();
    if (this.isActive(id)) {
      const voice = this.voices.get(id);
      if (voice && voice.restart) voice.restart();
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

  /** Explicitly stop a single tone (used when a rapid-fire hold is released). */
  stopOne(id, onChange) {
    this._stop(id);
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

  // Cuts off whatever's currently scheduled and starts a fresh cycle right
  // now — used both to retrigger a tone from the beginning and to make a
  // speed change (2X toggle) audible immediately instead of waiting for
  // the cycle in progress to finish.
  function rescheduleFromNow() {
    const now = ctx.currentTime;
    osc.frequency.cancelScheduledValues(now);
    gain.gain.cancelScheduledValues(now);
    cursor = now + 0.01;
    schedulerTick();
  }

  return {
    start() {
      osc.start();
      rescheduleFromNow();
      schedulerHandle = setInterval(schedulerTick, tickMs);
    },
    stop() {
      clearInterval(schedulerHandle);
      const now = ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setTargetAtTime(0, now, 0.03);
      osc.stop(now + 0.1);
    },
    restart() {
      rescheduleFromNow();
    },
    setSpeed(mult) {
      speed = mult;
      rescheduleFromNow();
    },
  };
}

/* ---- chord voice (sustained tone(s), optionally pulsed) ---------- */

function buildChordVoice(ctx, destination, def, initialSpeed) {
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

  let speed = initialSpeed;
  let pulseHandle = null;

  // (Re)starts the attack and, for pulsed tones (Rumbler, Station Horn,
  // Foghorn), the pulse cycle, right now — used for start, retrigger, and
  // making a speed change audible immediately.
  function beginFromNow() {
    if (pulseHandle) clearInterval(pulseHandle);
    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setTargetAtTime(1, now, 0.03);
    if (def.pulseRate && def.pulseRate > 0) {
      let cursor = now + 0.05;
      const N = 32;
      const schedule = () => {
        const t = ctx.currentTime;
        while (cursor < t + 0.25) {
          const period = 1 / def.pulseRate / speed;
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
  }

  return {
    start() {
      oscs.forEach((o) => o.start());
      beginFromNow();
    },
    stop() {
      if (pulseHandle) clearInterval(pulseHandle);
      const now = ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setTargetAtTime(0, now, 0.05);
      oscs.forEach((o) => o.stop(now + 0.15));
    },
    restart() {
      beginFromNow();
    },
    setSpeed(mult) {
      speed = mult;
      beginFromNow();
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
    restart() {
      audio.currentTime = 0;
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

function saveOrder(ids, storageKey) {
  localStorage.setItem(storageKey, JSON.stringify(ids));
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
const customEmptyHint = document.getElementById("customEmptyHint");
const speedToggle = document.getElementById("speedToggle");
const volumeSlider = document.getElementById("volumeSlider");
const stopAllBtn = document.getElementById("stopAll");
const uploadPanel = document.getElementById("uploadPanel");
const uploadToggle = document.getElementById("uploadToggle");
const uploadForm = document.getElementById("uploadForm");
const uploadCancel = document.getElementById("uploadCancel");
const tabRegular = document.getElementById("tabRegular");
const tabDispatcher = document.getElementById("tabDispatcher");
const tabCustom = document.getElementById("tabCustom");
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

const HOLD_THRESHOLD_MS = 250; // press-and-hold past this engages rapid-fire
const RAPID_FIRE_MS = 150;     // retrigger interval while held — "crazy fast"

// Tap starts a tone, or (if it's already playing) retriggers it from the
// beginning — like tapping a real siren box. Holding a tone down retriggers
// it over and over, rapid-fire, for as long as it's held (like mashing the
// button); releasing after a real hold stops it — that's the way to turn a
// single tone off short of Stop All. The hold is detected via pointer
// timing, but the tap action itself always runs from the "click" event so
// mouse, touch, and keyboard activation (Enter/Space) all behave the same.
function wireTileTap(tile, { onTap, onRepeat, onRelease }) {
  let holdTimer = null;
  let rapidInterval = null;
  let holdEngaged = false;
  const isControl = (target) => !!target.closest?.(".tile-actions, .remove");

  tile.addEventListener("pointerdown", (e) => {
    if (isControl(e.target)) return;
    holdEngaged = false;
    holdTimer = setTimeout(() => {
      holdEngaged = true;
      onRepeat();
      rapidInterval = setInterval(onRepeat, RAPID_FIRE_MS);
    }, HOLD_THRESHOLD_MS);
  });

  const release = () => {
    if (holdTimer) {
      clearTimeout(holdTimer);
      holdTimer = null;
    }
    if (rapidInterval) {
      clearInterval(rapidInterval);
      rapidInterval = null;
    }
    if (holdEngaged) onRelease();
  };
  tile.addEventListener("pointerup", release);
  tile.addEventListener("pointerleave", release);
  tile.addEventListener("pointercancel", release);

  tile.addEventListener("click", (e) => {
    if (isControl(e.target)) return;
    if (holdEngaged) {
      holdEngaged = false;
      return;
    }
    onTap();
  });
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

function renderCustomTile(custom) {
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
    renderGrid();
  });
  btn.appendChild(remove);

  wireTileTap(btn, {
    onTap: () => engine.triggerAudio(custom.id, custom.blobUrl, refreshStates),
    onRepeat: () => engine.triggerAudio(custom.id, custom.blobUrl, refreshStates),
    onRelease: () => engine.stopOne(custom.id, refreshStates),
  });
  return btn;
}

function renderGrid() {
  grid.innerHTML = "";

  if (currentCategory === "custom") {
    const list = getOrderedList(customSirens, "tons-order-custom");
    for (const custom of list) grid.appendChild(renderCustomTile(custom));
    customEmptyHint.classList.toggle("hidden", customSirens.length > 0);
    uploadPanel.classList.remove("hidden");
  } else {
    const base = currentCategory === "dispatcher" ? DISPATCH_SIRENS : REGULAR_SIRENS;
    const list = getOrderedList(base, `tons-order-${currentCategory}`);
    for (const def of list) {
      const btn = makeButton(def);
      addTileActions(btn, {
        onShare: (shareBtn) => shareSirenDef(def, shareBtn),
        onDownload: (dlBtn) => downloadSirenDef(def, dlBtn),
      });
      wireTileTap(btn, {
        onTap: () => engine.trigger(def, refreshStates),
        onRepeat: () => engine.trigger(def, refreshStates),
        onRelease: () => engine.stopOne(def.id, refreshStates),
      });
      grid.appendChild(btn);
    }
    customEmptyHint.classList.add("hidden");
    uploadPanel.classList.add("hidden");
  }

  refreshStates();
}

function refreshAfterReorder() {
  renderGrid();
}

function renderReorderList(ulEl, items, storageKey) {
  const list = getOrderedList(items, storageKey);
  ulEl.innerHTML = "";

  list.forEach((item, idx) => {
    const li = document.createElement("li");
    li.className = "reorder-row";
    li.dataset.id = item.id;
    li.innerHTML = `
      <span class="reorder-handle" title="Drag to reorder">⠿</span>
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
      saveOrder(list.map((d) => d.id), storageKey);
      renderReorderList(ulEl, items, storageKey);
      refreshAfterReorder();
    });
    li.querySelector(".down").addEventListener("click", () => {
      if (idx === list.length - 1) return;
      [list[idx + 1], list[idx]] = [list[idx], list[idx + 1]];
      saveOrder(list.map((d) => d.id), storageKey);
      renderReorderList(ulEl, items, storageKey);
      refreshAfterReorder();
    });
    ulEl.appendChild(li);
  });
}

// Touch-friendly drag-to-reorder: drag the ⠿ handle and drop the row where
// you want it, instead of clicking the up/down arrows repeatedly. Wired
// once per list via delegation on the <ul> so it survives re-renders.
function enableDragReorder(ulEl, items, storageKey) {
  let draggedLi = null;

  function onPointerMove(e) {
    if (!draggedLi) return;
    const y = e.clientY;
    const siblings = [...ulEl.querySelectorAll(".reorder-row")].filter((el) => el !== draggedLi);
    for (const sib of siblings) {
      const rect = sib.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      const draggedIsAfter = !!(sib.compareDocumentPosition(draggedLi) & Node.DOCUMENT_POSITION_FOLLOWING);
      if (y < midpoint && draggedIsAfter) {
        ulEl.insertBefore(draggedLi, sib);
        break;
      }
      if (y > midpoint && !draggedIsAfter) {
        ulEl.insertBefore(draggedLi, sib.nextSibling);
        break;
      }
    }
  }

  function onPointerUp() {
    if (!draggedLi) return;
    draggedLi.classList.remove("dragging");
    draggedLi = null;
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
    document.removeEventListener("pointercancel", onPointerUp);
    const newIds = [...ulEl.querySelectorAll(".reorder-row")].map((li) => li.dataset.id);
    saveOrder(newIds, storageKey);
    renderReorderList(ulEl, items, storageKey);
    refreshAfterReorder();
  }

  ulEl.addEventListener("pointerdown", (e) => {
    const handle = e.target.closest(".reorder-handle");
    if (!handle) return;
    const li = handle.closest(".reorder-row");
    if (!li) return;
    e.preventDefault();
    draggedLi = li;
    li.classList.add("dragging");
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointercancel", onPointerUp);
  });
}

enableDragReorder(reorderRegularList, REGULAR_SIRENS, "tons-order-regular");
enableDragReorder(reorderDispatcherList, DISPATCH_SIRENS, "tons-order-dispatcher");
enableDragReorder(reorderCustomList, customSirens, "tons-order-custom");

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
      sub.textContent = active ? "hold: rapid-fire" : sub.dataset.idle;
    }
  });
}

function setCategory(cat) {
  currentCategory = cat;
  tabRegular.classList.toggle("active", cat === "regular");
  tabRegular.setAttribute("aria-selected", String(cat === "regular"));
  tabDispatcher.classList.toggle("active", cat === "dispatcher");
  tabDispatcher.setAttribute("aria-selected", String(cat === "dispatcher"));
  tabCustom.classList.toggle("active", cat === "custom");
  tabCustom.setAttribute("aria-selected", String(cat === "custom"));
  renderGrid();
}

tabRegular.addEventListener("click", () => setCategory("regular"));
tabDispatcher.addEventListener("click", () => setCategory("dispatcher"));
tabCustom.addEventListener("click", () => setCategory("custom"));

speedToggle.addEventListener("click", () => {
  const pressed = speedToggle.getAttribute("aria-pressed") === "true";
  const next = !pressed;
  speedToggle.setAttribute("aria-pressed", String(next));
  engine.setSpeed(next ? 2 : 1);
});

function updateVolumeFill() {
  volumeSlider.style.setProperty("--fill", `${volumeSlider.value}%`);
}

volumeSlider.addEventListener("input", () => {
  engine.ensureContext();
  engine.setVolume(Number(volumeSlider.value) / 100);
  updateVolumeFill();
});
updateVolumeFill();

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
  customSirens.unshift({ id, name: nameInput.value.trim() || "Custom Siren", blobUrl });

  // New custom tones jump straight to the top of the list — getOrderedList
  // otherwise appends anything not already in a saved order to the end,
  // which is exactly why a freshly uploaded tone used to land at the
  // bottom no matter what.
  let order = [];
  try {
    order = JSON.parse(localStorage.getItem("tons-order-custom") || "[]");
  } catch {
    order = [];
  }
  saveOrder([id, ...order], "tons-order-custom");

  uploadForm.reset();
  uploadForm.classList.add("hidden");
  setCategory("custom");
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
  renderGrid();
}

renderGrid();
loadCustomFromDb();

/* ------------------------------------------------------------------ *
 * PWA install: registering a service worker (plus the manifest's
 * start_url/scope) is what makes Chrome consider this site installable
 * at all — without one, Chrome's automatic "Add to Home screen" banner
 * never appears, no matter how good the manifest is. Chrome still
 * decides the exact timing/heuristics for that automatic banner on its
 * own; the button below is a user-triggerable fallback for the same
 * install flow, shown only once the browser confirms eligibility.
 * ------------------------------------------------------------------ */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch((err) => console.warn("Service worker registration failed:", err));
  });
}

const installBtn = document.getElementById("installBtn");
let deferredInstallPrompt = null;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  installBtn.classList.remove("hidden");
});

installBtn.addEventListener("click", async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  installBtn.classList.add("hidden");
});

window.addEventListener("appinstalled", () => {
  installBtn.classList.add("hidden");
  deferredInstallPrompt = null;
});
