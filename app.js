/**
 * =========================================================================
 * 🚀 APP.JS - KADO VIRTUAL BESTIE (MIDNIGHT SAPPHIRE EDITION)
 * - Music plays EXCLUSIVELY upon entering the Playlist page!
 * - Automatic pause when navigating back from Playlist
 * - Built-in Pure Web Audio Music Box Synthesizer
 * - Centered Scratch Card with Golden Shimmer
 * =========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const config = window.KADO_CONFIG;
  if (!config) {
    console.error('KADO_CONFIG is missing!');
    return;
  }

  // Element Selectors
  const screens = {
    intro: document.getElementById('screen-intro'),
    cake: document.getElementById('screen-cake'),
    hub: document.getElementById('screen-hub'),
    journey: document.getElementById('screen-journey'),
    moment: document.getElementById('screen-moment'),
    playlist: document.getElementById('screen-playlist'),
    gift: document.getElementById('screen-gift')
  };

  const audioToggle = document.getElementById('audioToggle');
  const btnPlaylistPlay = document.getElementById('btnPlaylistPlay');
  const confettiCanvas = document.getElementById('confetti-canvas');

  // Setup Dynamic Content
  populateConfigData(config);

  // Setup Confetti Engine
  const confetti = initConfetti(confettiCanvas);

  // Setup Built-in Music Box Synthesizer
  const musicBox = new MusicBoxPlayer();

  // 1. Envelope Tap -> Open & Proceed to Cake Screen (NO MUSIC HERE)
  const envelopeEl = document.getElementById('mainEnvelope');
  if (envelopeEl) {
    envelopeEl.addEventListener('click', () => {
      if (envelopeEl.classList.contains('opened')) return;

      envelopeEl.classList.add('opened');
      confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 50);

      setTimeout(() => {
        showScreen('cake');
        confetti.burst(window.innerWidth / 2, window.innerHeight * 0.4, 30);
      }, 850);
    });
  }

  // 2. Cake & Candle Interaction
  const cakeStage = document.getElementById('cakeStage');
  const candleEl = document.getElementById('mainCandle');
  const candleHint = document.getElementById('candleHint');
  const cakeAfterAction = document.getElementById('cakeAfterAction');
  const btnGoToHub = document.getElementById('btnGoToHub');

  if (cakeStage) {
    cakeStage.addEventListener('click', blowCandle);
  }

  function blowCandle() {
    if (candleEl.classList.contains('blown')) return;

    candleEl.classList.add('blown');
    musicBox.playBlowPuff();
    confetti.burst(window.innerWidth / 2, window.innerHeight * 0.45, 80);

    candleHint.textContent = config.cake.afterBlowMessage;
    candleHint.style.color = "var(--accent-gold-soft)";
    cakeAfterAction.style.display = 'block';
  }

  if (btnGoToHub) {
    btnGoToHub.addEventListener('click', () => {
      showScreen('hub');
      confetti.burst(window.innerWidth / 2, 100, 30);
    });
  }

  // 3. Hub Menu Buttons -> Detail Views
  document.querySelectorAll('[data-target-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetView = btn.getAttribute('data-target-view');
      showScreen(targetView);

      if (targetView === 'moment') {
        typeLetterEffect();
      } else if (targetView === 'playlist') {
        // ✨ LAGU HANYA BERPUTAR KETIKA USER MASUK KE HALAMAN PLAYLIST!
        musicBox.start();
        updatePlaylistUI(true);
      } else if (targetView === 'gift') {
        requestAnimationFrame(() => {
          initScratchCard();
        });
      }
    });
  });

  // 4. Back Navigation Buttons
  document.querySelectorAll('.btn-back').forEach(btn => {
    btn.addEventListener('click', () => {
      showScreen('hub');
      // Otomatis jeda musik jika keluar dari halaman playlist
      if (musicBox.isPlaying) {
        musicBox.stop();
        updatePlaylistUI(false);
      }
    });
  });

  // 5. In-Playlist Play/Pause Button
  if (btnPlaylistPlay) {
    btnPlaylistPlay.addEventListener('click', () => {
      if (musicBox.isPlaying) {
        musicBox.stop();
        updatePlaylistUI(false);
      } else {
        musicBox.start();
        updatePlaylistUI(true);
      }
    });
  }

  // 6. Floating Audio Toggle Control
  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      if (musicBox.isPlaying) {
        musicBox.stop();
        updatePlaylistUI(false);
      } else {
        musicBox.start();
        updatePlaylistUI(true);
      }
    });
  }

  function updatePlaylistUI(isPlaying) {
    const vinyl = document.getElementById('vinylDisk');
    if (vinyl) {
      if (isPlaying) {
        vinyl.classList.add('spinning');
      } else {
        vinyl.classList.remove('spinning');
      }
    }
    if (btnPlaylistPlay) {
      btnPlaylistPlay.innerHTML = isPlaying 
        ? `<span>⏸ Jeda Musik</span>` 
        : `<span>▶ Putar Musik</span>`;
    }
    if (audioToggle) {
      if (isPlaying) {
        audioToggle.classList.add('playing');
        audioToggle.setAttribute('aria-label', 'Jeda Musik');
      } else {
        audioToggle.classList.remove('playing');
        audioToggle.setAttribute('aria-label', 'Putar Musik');
      }
    }
  }

  // Screen Switcher Helper
  function showScreen(name) {
    Object.keys(screens).forEach(key => {
      if (screens[key]) {
        screens[key].classList.remove('active');
      }
    });
    if (screens[name]) {
      screens[name].classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Populate Dynamic Data
  function populateConfigData(cfg) {
    document.querySelectorAll('.cfg-recipient').forEach(el => el.textContent = cfg.recipientName);
    document.querySelectorAll('.cfg-nickname').forEach(el => el.textContent = cfg.recipientNickname);
    document.querySelectorAll('.cfg-sender').forEach(el => el.textContent = cfg.senderName);
    document.querySelectorAll('.cfg-date').forEach(el => el.textContent = cfg.birthdayDate);

    // Journey Polaroids
    const polaroidContainer = document.getElementById('polaroidContainer');
    if (polaroidContainer && cfg.journey.photos) {
      polaroidContainer.innerHTML = '';
      cfg.journey.photos.forEach(photo => {
        const card = document.createElement('div');
        card.className = 'polaroid-card';
        card.innerHTML = `
          <div class="polaroid-inner">
            <div class="polaroid-front">
              <div class="polaroid-photo-frame">
                <img src="${photo.url}" alt="${photo.caption}" loading="lazy">
              </div>
              <div class="polaroid-caption">${photo.caption}</div>
              <div class="polaroid-tap-hint">Tap untuk balik kartu ↺</div>
            </div>
            <div class="polaroid-back">
              <div class="polaroid-memory-text">"${photo.memory}"</div>
              <div class="polaroid-tap-hint">Tap untuk balik lagi ↺</div>
            </div>
          </div>
        `;
        card.addEventListener('click', () => card.classList.toggle('flipped'));
        polaroidContainer.appendChild(card);
      });
    }

    // Playlist Info
    document.getElementById('songTitle').textContent = cfg.playlist.songTitle;
    document.getElementById('artistName').textContent = cfg.playlist.artist;
    const lyricsBox = document.getElementById('lyricsBox');
    if (lyricsBox && cfg.playlist.lyricsHighlight) {
      lyricsBox.innerHTML = cfg.playlist.lyricsHighlight.map((l, i) => 
        `<div class="lyrics-line ${i === 0 ? 'highlight' : ''}">${l}</div>`
      ).join('');
    }

    // Gift Info
    document.getElementById('rewardTitle').textContent = cfg.gift.rewardTitle;
    document.getElementById('rewardPrize').textContent = cfg.gift.rewardPrize;
    document.getElementById('rewardPerk').textContent = cfg.gift.rewardPerk;
    document.getElementById('voucherCodeText').textContent = cfg.gift.voucherCode;
  }

  // Typewriter Letter Animation
  let letterTyped = false;
  function typeLetterEffect() {
    if (letterTyped) return;
    const container = document.getElementById('letterBodyContent');
    if (!container) return;
    container.innerHTML = '';

    const paras = config.moment.letterParagraphs;
    let pIndex = 0;
    let charIndex = 0;
    letterTyped = true;

    function typeNext() {
      if (pIndex >= paras.length) return;
      if (charIndex === 0) {
        const p = document.createElement('p');
        p.id = `para-${pIndex}`;
        container.appendChild(p);
      }
      const currentP = document.getElementById(`para-${pIndex}`);
      currentP.textContent += paras[pIndex][charIndex];
      charIndex++;

      if (charIndex < paras[pIndex].length) {
        setTimeout(typeNext, 18);
      } else {
        pIndex++;
        charIndex = 0;
        setTimeout(typeNext, 250);
      }
    }
    typeNext();
  }

  // Scratch Card Canvas (Perfect Centering & Auto-Clear)
  let scratchInitialized = false;
  function initScratchCard() {
    if (scratchInitialized) return;
    const canvas = document.getElementById('scratchCanvas');
    if (!canvas) return;

    scratchInitialized = true;
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    
    const width = container.clientWidth || 320;
    const height = container.clientHeight || 170;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Antique Gold Metallic Texture
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#d4af37');
    grad.addColorStop(0.5, '#f5e6b8');
    grad.addColorStop(1, '#aa8230');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // Centered Instructions
    ctx.fillStyle = '#1c2238';
    ctx.font = '700 14px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦ GOSOK DI SINI ✦', width / 2, height / 2 - 8);

    ctx.fillStyle = '#3c486e';
    ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Sentuh atau gesek perlahan dengan jari', width / 2, height / 2 + 14);

    let isScratching = false;
    let scratchedPixels = 0;
    let hasCleared = false;

    function scratch(e) {
      if (!isScratching || hasCleared) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      if (clientX === undefined || clientY === undefined) return;

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();

      scratchedPixels++;
      if (scratchedPixels > 40 && !hasCleared) {
        hasCleared = true;
        setTimeout(() => {
          ctx.clearRect(0, 0, width, height);
          confetti.burst(window.innerWidth / 2, window.innerHeight * 0.5, 70);
        }, 300);
      }
    }

    canvas.addEventListener('mousedown', () => isScratching = true);
    window.addEventListener('mouseup', () => isScratching = false);
    canvas.addEventListener('mousemove', scratch);

    canvas.addEventListener('touchstart', (e) => {
      isScratching = true;
      scratch(e);
    }, { passive: true });
    window.addEventListener('touchend', () => isScratching = false);
    canvas.addEventListener('touchmove', scratch, { passive: true });
  }

  // =========================================================================
  // 🎵 BUILT-IN MUSIC BOX SYNTHESIZER
  // =========================================================================
  function MusicBoxPlayer() {
    this.ctx = null;
    this.isPlaying = false;
    this.step = 0;
    this.timer = null;

    this.notes = [
      659.25, 783.99, 1046.50, 987.77, 783.99, 880.00, 1046.50, 1318.51,
      1174.66, 987.77, 783.99, 880.00, 659.25, 523.25, 587.33, 523.25
    ];

    this.initContext = () => {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    };

    this.playTine = (freq) => {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2.01, now);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.8);
      osc2.stop(now + 1.8);
    };

    this.playBlowPuff = () => {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const bufferSize = this.ctx.sampleRate * 0.35;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(700, now);
      filter.frequency.exponentialRampToValueAtTime(120, now + 0.35);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
    };

    this.tick = () => {
      if (!this.isPlaying) return;
      const freq = this.notes[this.step % this.notes.length];
      this.playTine(freq);
      this.step++;
      this.timer = setTimeout(this.tick, 450);
    };

    this.start = () => {
      this.initContext();
      if (this.isPlaying) return;
      this.isPlaying = true;
      this.tick();
    };

    this.stop = () => {
      this.isPlaying = false;
      if (this.timer) clearTimeout(this.timer);
    };
  }

  // =========================================================================
  // ✨ GOLDEN STARDUST CONFETTI ENGINE (60 FPS CANVAS)
  // =========================================================================
  function initConfetti(canvas) {
    if (!canvas) return { burst: () => {} };
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrame = null;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const colors = [
      '#e0c27b', // Antique Gold
      '#f5e6b8', // Champagne Soft
      '#a68235', // Rich Ochre
      '#ffffff', // Pure White Star
      '#818cf8', // Soft Starlight Blue
      '#d4af37'  // Deep Gold
    ];

    function burst(originX, originY, count = 50) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 2.5;
        particles.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2.5,
          size: Math.random() * 7 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 10,
          alpha: 1,
          decay: Math.random() * 0.015 + 0.009
        });
      }
      if (!animationFrame) {
        loop();
      }
    }

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22;
        p.rotation += p.rotSpeed;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }

      if (particles.length > 0) {
        animationFrame = requestAnimationFrame(loop);
      } else {
        animationFrame = null;
      }
    }

    return { burst };
  }
});
