// HỌA DIỆN (The Dual Mask) - Vietnamese Cultural Audio Engine & Safezone Ambience
// Web Audio Synthesizer: Trống Chầu (TÙNG & CẮC), Đàn Tranh, Mưa Ngói, Đồng Hồ Tích Tắc & Lửa Đèn Dầu
window.GameAudio = (function () {
  let ctx = null;
  let masterGain = null;
  let muted = false;
  try {
    muted = localStorage.getItem('hoa_dien_muted') === '1';
  } catch (e) {}

  // Safezone Ambience Loops
  let rainSource = null;
  let rainGain = null;
  let clockInterval = null;
  let danTranhInterval = null;
  let lampCrackleInterval = null;
  let isSafezonePlaying = false;
  let clockTickState = false;

  function init() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        ctx = new AudioCtx();
        masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(muted ? 0 : 1, ctx.currentTime);
        masterGain.connect(ctx.destination);
      }
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
  }

  function getOutputNode() {
    return masterGain || (ctx ? ctx.destination : null);
  }

  function setMuted(nextMuted) {
    muted = !!nextMuted;
    try {
      localStorage.setItem('hoa_dien_muted', muted ? '1' : '0');
    } catch (e) {}
    if (masterGain && ctx) {
      masterGain.gain.setValueAtTime(muted ? 0 : 1, ctx.currentTime);
    }
    if (rainGain && ctx) {
      rainGain.gain.setValueAtTime(muted ? 0 : 0.032, ctx.currentTime);
    }
    if (hallWindGain && ctx) {
      hallWindGain.gain.setValueAtTime(muted ? 0 : 0.024, ctx.currentTime);
    }
    try {
      window.dispatchEvent(new CustomEvent('hoa-dien-mute-change', { detail: { muted } }));
    } catch (e) {}
    return muted;
  }

  function playTone(freqStart, freqEnd, duration, type = 'sine', volume = 0.15) {
    if (muted) return;
    init();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freqStart, ctx.currentTime);
      if (freqEnd !== freqStart) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 10), ctx.currentTime + duration);
      }
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(getOutputNode());
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }

  function playNoise(duration, volume = 0.05, filterFreq = 800, filterType = 'lowpass') {
    if (muted) return;
    init();
    if (!ctx) return;
    try {
      const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration));
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = filterType;
      filter.frequency.setValueAtTime(filterFreq, ctx.currentTime);
      if (filterType === 'lowpass') {
        filter.frequency.linearRampToValueAtTime(Math.max(80, filterFreq * 0.25), ctx.currentTime + duration);
      }
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(getOutputNode());
      noise.start();
    } catch (e) {}
  }

  // Đàn Tranh / Đàn Bầu Pluck note simulation with warm pentatonic harmonics
  function playDanTranhNote(freq, volume = 0.08) {
    if (muted) return;
    init();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Fundamental + gentle shimmer octave
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      // Subtle pitch bend down on pluck (nuance of Vietnamese traditional zither)
      osc.frequency.exponentialRampToValueAtTime(freq * 0.992, now + 1.2);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 3.5, now);
      filter.frequency.exponentialRampToValueAtTime(freq * 1.2, now + 1.2);

      // Fast pluck attack and long, tranquil acoustic decay
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(getOutputNode());

      osc.start(now);
      osc2.start(now);
      osc.stop(now + 2.2);
      osc2.stop(now + 2.2);
    } catch (e) {}
  }

  // Pentatonic melodies in Nam Ai / Nam Binh scale (C, D, F, G, A, C, D)
  const pentatonicScale = [
    261.63, // C4
    293.66, // D4
    349.23, // F4
    392.00, // G4
    440.00, // A4
    523.25, // C5
    587.33  // D5
  ];

  function playContemplativePhrase() {
    if (muted || !isSafezonePlaying) return;
    // Slow, meditative 3-4 note motifs with wide breath space
    const phrasePatterns = [
      [pentatonicScale[1], pentatonicScale[3], pentatonicScale[4]],
      [pentatonicScale[4], pentatonicScale[3], pentatonicScale[2], pentatonicScale[1]],
      [pentatonicScale[2], pentatonicScale[4], pentatonicScale[5], pentatonicScale[4]],
      [pentatonicScale[0], pentatonicScale[2], pentatonicScale[3]]
    ];
    const phrase = phrasePatterns[Math.floor(Math.random() * phrasePatterns.length)];
    phrase.forEach((freq, idx) => {
      setTimeout(() => {
        if (!muted && isSafezonePlaying) {
          playDanTranhNote(freq, 0.07);
        }
      }, idx * 750); // Very slow, calm spacing ~750ms between notes
    });
  }

  // Safezone Ambient Background Loop (Rain on roof + Clock + Oil Lamp + Dan Tranh)
  function startSafezoneAmbience() {
    if (isSafezonePlaying) return;
    init();
    if (!ctx) return;
    isSafezonePlaying = true;

    try {
      // 1. Continuous Rain on clay roof (gentle lowpass pink noise)
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.95 * b1 + white * 0.03;
        b2 = 0.85 * b2 + white * 0.01;
        data[i] = (b0 + b1 + b2) * 0.35;
      }
      rainSource = ctx.createBufferSource();
      rainSource.buffer = buffer;
      rainSource.loop = true;

      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = 'lowpass';
      rainFilter.frequency.setValueAtTime(360, ctx.currentTime);

      rainGain = ctx.createGain();
      rainGain.gain.setValueAtTime(muted ? 0 : 0.032, ctx.currentTime);

      rainSource.connect(rainFilter);
      rainFilter.connect(rainGain);
      rainGain.connect(getOutputNode());
      rainSource.start();
    } catch (e) {}

    // 2. Pendulum Wall Clock: Tick-Tock every 1.1s (54 BPM)
    clockInterval = setInterval(() => {
      if (!muted && isSafezonePlaying) {
        clockTickState = !clockTickState;
        playTone(clockTickState ? 1600 : 1250, clockTickState ? 850 : 700, 0.016, 'triangle', 0.035);
        playNoise(0.012, 0.02, 2200, 'bandpass');
      }
    }, 1100);

    // 3. Oil Lamp Subtle Crackle
    lampCrackleInterval = setInterval(() => {
      if (!muted && isSafezonePlaying && Math.random() < 0.45) {
        playNoise(0.02, 0.018, 1400, 'highpass');
      }
    }, 2800);

    // 4. Meditative Dan Tranh phrases every 9-14 seconds
    danTranhInterval = setInterval(() => {
      if (!muted && isSafezonePlaying) {
        playContemplativePhrase();
      }
    }, 11000);

    // Play first motif shortly after starting
    setTimeout(() => {
      if (!muted && isSafezonePlaying) playContemplativePhrase();
    }, 2200);
  }

  function stopSafezoneAmbience() {
    isSafezonePlaying = false;
    if (rainSource) {
      try { rainSource.stop(); } catch (e) {}
      rainSource = null;
    }
    if (clockInterval) {
      clearInterval(clockInterval);
      clockInterval = null;
    }
    if (lampCrackleInterval) {
      clearInterval(lampCrackleInterval);
      lampCrackleInterval = null;
    }
    if (danTranhInterval) {
      clearInterval(danTranhInterval);
      danTranhInterval = null;
    }
  }

  // Hall 1 Cold Ambience Loop (Echoing wind & rain on large glass arches)
  let hallWindSource = null;
  let hallWindGain = null;
  let isHallPlaying = false;

  function startHallAmbience() {
    if (isHallPlaying) return;
    init();
    if (!ctx) return;
    isHallPlaying = true;
    try {
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.2;
      hallWindSource = ctx.createBufferSource();
      hallWindSource.buffer = buffer;
      hallWindSource.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);
      filter.Q.setValueAtTime(3.0, ctx.currentTime);

      hallWindGain = ctx.createGain();
      hallWindGain.gain.setValueAtTime(muted ? 0 : 0.024, ctx.currentTime);

      hallWindSource.connect(filter);
      filter.connect(hallWindGain);
      hallWindGain.connect(getOutputNode());
      hallWindSource.start();
    } catch (e) {}
  }

  function stopHallAmbience() {
    isHallPlaying = false;
    if (hallWindSource) {
      try { hallWindSource.stop(); } catch (e) {}
      hallWindSource = null;
    }
  }

  return {
    init,
    startSafezoneAmbience,
    stopSafezoneAmbience,
    startHallAmbience,
    stopHallAmbience,
    setMuted,
    toggleMute() {
      return setMuted(!muted);
    },
    isMuted() {
      return muted;
    },
    getAudioStatus() {
      return {
        muted,
        hasContext: !!ctx,
        contextState: ctx ? ctx.state : 'uninitialized',
        masterGainValue: masterGain ? masterGain.gain.value : null,
        isSafezonePlaying,
        isHallPlaying
      };
    },
    dispose() {
      stopSafezoneAmbience();
      stopHallAmbience();
      if (ctx) {
        try { ctx.close(); } catch (e) {}
        ctx = null;
        masterGain = null;
      }
    },
    // Tiếng bước chân sàn gỗ êm ái trong xưởng
    step() {
      playNoise(0.04, 0.022, 420, 'lowpass');
      playTone(105, 65, 0.04, 'triangle', 0.035);
    },
    // Tiếng bước chân sàn đá cẩm thạch vang đanh ở Tầng 1
    stepMarble() {
      playNoise(0.035, 0.03, 1600, 'bandpass');
      playTone(280, 150, 0.035, 'sine', 0.038);
    },
    // Tiếng chuông khánh đồng cổ trang nghiêm khi dâng lễ Thánh Tổ
    templeBell() {
      if (muted) return;
      init();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const freqs = [220, 440, 660, 920];
        freqs.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = idx === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(f, now);
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.18 / (idx + 1), now + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);
          osc.connect(gain);
          gain.connect(getOutputNode());
          osc.start(now);
          osc.stop(now + 3.2);
        });
      } catch (e) {}
    },
    // Tiếng gõ chữ hội thoại
    talkBlip(pitch = 420) {
      playTone(pitch + (Math.random() - 0.5) * 45, pitch, 0.032, 'triangle', 0.048);
    },
    // Trống Chầu: "TÙNG!" (Khen ngợi / Ghép đúng mệnh đề / Da trống trầm ấm)
    drumTung() {
      playTone(142, 54, 0.52, 'sine', 0.38);
      playTone(92, 42, 0.56, 'triangle', 0.28);
      playNoise(0.09, 0.14, 320, 'lowpass');
    },
    // Trống Chầu: "CẮC!" (Chê trách / Ghép sai mệnh đề / Vành gỗ đanh khô)
    drumCac() {
      playTone(1100, 440, 0.075, 'square', 0.22);
      playTone(1750, 850, 0.055, 'triangle', 0.18);
      playNoise(0.045, 0.16, 2400, 'bandpass');
    },
    // Mở/Đóng Sổ tay Suy luận [TAB]
    journalOpen() {
      playTone(480, 620, 0.08, 'sine', 0.09);
      playNoise(0.06, 0.035, 1100, 'bandpass');
    },
    journalClose() {
      playTone(620, 440, 0.08, 'sine', 0.09);
      playNoise(0.06, 0.035, 1100, 'bandpass');
    },
    // Thẻ từ khóa đưa vào ô
    slotDrop() {
      playTone(680, 880, 0.06, 'sine', 0.11);
    },
    // Sấm chớp đêm mưa
    thunder() {
      playNoise(1.3, 0.16, 170, 'lowpass');
      playTone(65, 30, 0.95, 'sawtooth', 0.1);
    },
    // Thu thập manh mối / Từ khóa mới
    clueDiscovered() {
      playTone(523.25, 659.25, 0.12, 'sine', 0.15);
      setTimeout(() => playTone(659.25, 1046.5, 0.26, 'sine', 0.16), 110);
    },
    // Khúc nhạc Đàn Nhị khải hoàn khi mở chốt khóa cửa
    doorUnlocked() {
      this.drumTung();
      const notes = [440, 523.25, 659.25, 880];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          if (muted) return;
          init();
          if (!ctx) return;
          try {
            const osc = ctx.createOscillator();
            const vib = ctx.createOscillator();
            const vibGain = ctx.createGain();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            vib.frequency.setValueAtTime(5.5, ctx.currentTime);
            vibGain.gain.setValueAtTime(8, ctx.currentTime);
            vib.connect(vibGain);
            vibGain.connect(osc.frequency);
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(freq * 1.6, ctx.currentTime);
            filter.Q.setValueAtTime(2.5, ctx.currentTime);
            gain.gain.setValueAtTime(0.01, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.07);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(getOutputNode());
            osc.start();
            vib.start();
            osc.stop(ctx.currentTime + 0.55);
            vib.stop(ctx.currentTime + 0.55);
          } catch (e) {}
        }, idx * 130);
      });
    },
    // Tiếng xoay vòng số kim loại của Hòm sắt Pháp (L'année du grand feu)
    dialClick() {
      playTone(1800, 950, 0.028, 'triangle', 0.09);
      playNoise(0.015, 0.045, 3400, 'bandpass');
    },
    // Tiếng bật nắp hòm sắt nặng trịch
    chestOpen() {
      playTone(180, 70, 0.22, 'triangle', 0.18);
      playNoise(0.12, 0.15, 600, 'lowpass');
      setTimeout(() => playTone(540, 720, 0.15, 'sine', 0.12), 150);
    },
    // Tiếng rót dung dịch hóa chất vào khay men
    liquidPour() {
      playNoise(0.35, 0.07, 1200, 'bandpass');
      playTone(420, 310, 0.2, 'sine', 0.04);
    },
    // Tiếng đồng hồ quả lắc phòng tối điểm nhịp (Cắc... tùng... cắc... tùng...)
    darkroomTick(isTung = false) {
      if (isTung) {
        // Nhịp TÙNG: Trầm ấm hơn
        playTone(320, 110, 0.065, 'sine', 0.14);
        playNoise(0.035, 0.04, 850, 'lowpass');
      } else {
        // Nhịp CẮC: Đanh cao hơn
        playTone(1250, 680, 0.038, 'triangle', 0.12);
        playNoise(0.02, 0.05, 2600, 'bandpass');
      }
    },
    // Tiếng nhúng phim chìm vào khay hóa chất dập dềnh
    waterSplash() {
      playNoise(0.18, 0.06, 950, 'bandpass');
      playTone(260, 180, 0.14, 'sine', 0.05);
    },
    // Tiếng hóa chất trung hòa xì xèo
    chemicalSizzle() {
      playNoise(0.45, 0.08, 4800, 'highpass');
    },
    // Tiếng cháy phim / tráng hỏng
    filmBurned() {
      playNoise(0.65, 0.15, 520, 'lowpass');
      playTone(120, 45, 0.5, 'sawtooth', 0.15);
    },
    // Tiếng khải hoàn khi tấm ảnh 1930 tráng thành công
    photoRevealed() {
      this.drumTung();
      const chords = [523.25, 659.25, 783.99, 1046.5];
      chords.forEach((freq, idx) => {
        setTimeout(() => {
          playTone(freq, freq * 1.02, 0.8, 'sine', 0.12 / (idx + 1));
        }, idx * 90);
      });
    },
    // Tiếng dao cạo mộc cạo lớp sơn bồi vôi gai (sột... soạt...)
    scrapePaint() {
      playNoise(0.06, 0.065, 1900, 'bandpass');
      playTone(340, 210, 0.045, 'sawtooth', 0.04);
    },
    // Tiếng lò xo tre bật tách khi nhấn nốt ruồi son
    springClick() {
      playTone(1450, 620, 0.04, 'triangle', 0.16);
      setTimeout(() => playTone(980, 1650, 0.06, 'sine', 0.14), 45);
    },
    // Tiếng trượt mộng đuôi én gỗ lim (Rắc... rắc... KHẮC!)
    woodSlideStep() {
      playNoise(0.05, 0.08, 650, 'lowpass');
      playTone(190, 120, 0.05, 'triangle', 0.12);
    },
    woodLockSnap() {
      playNoise(0.08, 0.18, 900, 'bandpass');
      playTone(880, 260, 0.09, 'square', 0.24);
      setTimeout(() => this.drumTung(), 80);
    },
    // Tiếng đóng chốt gỗ mun khóa chết mộng
    pinHammer() {
      playTone(240, 85, 0.12, 'triangle', 0.25);
      playNoise(0.07, 0.14, 720, 'lowpass');
    }
  };
})();
