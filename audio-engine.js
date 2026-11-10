/**
 * VẠN TƯỢNG - Web Audio Synthesizer Engine
 * Tạo âm thanh mô phỏng trực tiếp bằng Web Audio API (không cần tải file ngoài)
 * Gồm: Trống trận, Chuông đồng, Giọt mực, Giấy dó, Vệt mực loang (Ink Swoosh)
 * & Nhạc chủ đề 4 di vật: Mặt nạ Tuồng, Bình gốm men rạn, Tiêu trúc sông Đuống, Bút lông chu sa.
 */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isInit = false;
    this.setupAutoUnlock();
  }

  // Cơ chế mở khóa Web Audio tự động trên mọi thiết bị (đặc biệt là iOS Safari với touchstart)
  setupAutoUnlock() {
    const unlock = () => {
      this.init();
      this.resume();
      if (this.ctx) {
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        // Phát một buffer rỗng siêu ngắn để iOS giải phóng khóa âm thanh hoàn toàn
        try {
          const buffer = this.ctx.createBuffer(1, 1, 22050);
          const source = this.ctx.createBufferSource();
          source.buffer = buffer;
          source.connect(this.ctx.destination);
          source.start(0);
        } catch (_) {}
      }

      if (this.ctx && this.ctx.state === 'running') {
        ['click', 'touchstart', 'touchend', 'keydown'].forEach(evt => {
          window.removeEventListener(evt, unlock, true);
          document.removeEventListener(evt, unlock, true);
        });
      }
    };

    ['click', 'touchstart', 'touchend', 'keydown'].forEach(evt => {
      window.addEventListener(evt, unlock, { passive: true, capture: true });
      document.addEventListener(evt, unlock, { passive: true, capture: true });
    });
  }

  init() {
    if (this.isInit) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.isInit = true;
    } catch(e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  // Tiếng trống đại/trống trận bập bùng
  playDrum() {
    if (this.isMuted || !this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(32, t + 0.9);
    gain.gain.setValueAtTime(0.75, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.1);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, t);
    filter.frequency.exponentialRampToValueAtTime(50, t + 0.85);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 1.2);
  }

  // Tiếng chuông đồng ngân vang
  playBell() {
    if (this.isMuted || !this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    [220, 440, 660, 880, 1320].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      const vol = 0.22 / (i + 1);
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.8);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 2.9);
    });
  }

  // Giọt mực nhỏ trên giấy dó
  playInk() {
    if (this.isMuted || !this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.16);
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.24);
  }

  // Tiếng sột soạt giấy dó
  playPaper() {
    if (this.isMuted || !this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.28;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, t);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);
  }

  // Tiếng vệt mực tàu loang cuộn xoáy The Boat (Cinematic Ink Swoosh)
  playInkSwoosh() {
    if (this.isMuted || !this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;

    // 1. Luồng gió rít mực tàu (Filtered noise sweep)
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.45);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.42));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, t);
    filter.frequency.exponentialRampToValueAtTime(1400, t + 0.18);
    filter.frequency.exponentialRampToValueAtTime(200, t + 0.42);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.44);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);

    // 2. Tiếng đọng mực sâu thẳm (Deep sub-harmonic resonance)
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(130, t);
    sub.frequency.exponentialRampToValueAtTime(65, t + 0.38);
    subGain.gain.setValueAtTime(0.32, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    sub.connect(subGain);
    subGain.connect(this.ctx.destination);
    sub.start(t);
    sub.stop(t + 0.42);
  }

  // 1. ÂM THANH MẶT NẠ TUỒNG TAM DIỆN: Tiếng kèn bóp tuồng ma mị & phách gỗ lim gõ nhịp
  playMaskTheme() {
    if (this.isMuted || !this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc2.type = 'square';
    osc.frequency.setValueAtTime(340, t);
    osc.frequency.exponentialRampToValueAtTime(260, t + 0.35);
    osc.frequency.exponentialRampToValueAtTime(310, t + 0.85);
    osc2.frequency.setValueAtTime(170, t);
    osc2.frequency.exponentialRampToValueAtTime(130, t + 0.85);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(680, t);
    filter.Q.value = 4.5;
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc2.start(t);
    osc.stop(t + 1.25);

    // Phách gỗ lim gõ nhịp tuồng (hai tiếng cách cách)
    [0.22, 0.52].forEach(delay => {
      const woodOsc = this.ctx.createOscillator();
      const woodGain = this.ctx.createGain();
      woodOsc.type = 'triangle';
      woodOsc.frequency.setValueAtTime(820, t + delay);
      woodOsc.frequency.exponentialRampToValueAtTime(140, t + delay + 0.08);
      woodGain.gain.setValueAtTime(0.55, t + delay);
      woodGain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.1);
      woodOsc.connect(woodGain);
      woodGain.connect(this.ctx.destination);
      woodOsc.start(t + delay);
      woodOsc.stop(t + delay + 0.11);
    });
  }

  playTuongTheme() {
    this.playMaskTheme();
  }

  // 2. ÂM THANH BÌNH GỐM MEN RẠN BÁT TRÀNG: Tiếng gõ men rạn thanh tao ngân vang
  playCeramicTheme() {
    if (this.isMuted || !this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    [1760, 2640, 3520].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.3 / (idx + 1), t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 2.3);
    });
    // Tiếng lò nung reo nhẹ
    const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.4, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.08;
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    const nFilter = this.ctx.createBiquadFilter();
    nFilter.type = 'highpass';
    nFilter.frequency.value = 2800;
    const nGain = this.ctx.createGain();
    nGain.gain.setValueAtTime(0.18, t);
    nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    noise.connect(nFilter);
    nFilter.connect(nGain);
    nGain.connect(this.ctx.destination);
    noise.start(t);
  }

  // 3. ÂM THANH TIÊU TRÚC MỤC ĐỒNG KINH BẮC: Tiếng sáo tiêu réo rắt u hoài sông Đuống
  playFluteTheme() {
    if (this.isMuted || !this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc1.type = 'sine';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(523.25, t); // C5
    osc1.frequency.exponentialRampToValueAtTime(587.33, t + 0.35); // D5
    osc1.frequency.exponentialRampToValueAtTime(659.25, t + 0.75); // E5
    osc1.frequency.exponentialRampToValueAtTime(783.99, t + 1.25); // G5
    osc2.frequency.setValueAtTime(523.25 * 2, t);
    osc2.frequency.exponentialRampToValueAtTime(783.99 * 2, t + 1.25);
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.38, t + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 2.1);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, t);
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 2.2);
    osc2.stop(t + 2.2);
  }

  // 4. ÂM THANH BÚT LÔNG & MỰC CHU SA: Tiếng khánh đồng thiêng liêng và nét vẽ sột soạt
  playBrushTheme() {
    if (this.isMuted || !this.ctx) return;
    this.resume();
    const t = this.ctx.currentTime;
    [528, 792, 1056].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.26 / (idx + 1), t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 2.7);
    });
    this.playPaper();
  }
}

// Khởi tạo instance toàn cục
const audio = new AudioEngine();
window.audio = audio;
window.AudioEngine = AudioEngine;
