/**
 * VẠN TƯỢNG - HIỆU ỨNG LỐC XOÁY MỰC TÀU 3D CHUYỂN CẢNH (HIGH PERFORMANCE 60 FPS)
 * Tối ưu triệt để: Loại bỏ cấp phát gradient per-frame, tăng tốc GPU compositing
 * Thời gian chuyển cảnh: 1000ms điện ảnh, siêu mượt mà không gây giật lag
 */

class InkVortexTransition {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.animId = null;
    this.isActive = false;
    this.progress = 0;
    this.duration = 1000; // 1s chuyển cảnh dứt khoát, mượt mà
    this.startTime = 0;
    this.onCompleteCallback = null;
    this.midpointFired = false;
    this.midpointTimer = null;
    this.finishTimer = null;

    // 4 dải mực xoắn ốc đối xứng tâm (cân bằng hoàn hảo giữa thẩm mỹ & hiệu năng)
    this.arms = 4;
    this.particles = [];
    this.mode = 'vortex'; // 'vortex' hoặc 'dissolve'
    this.initCanvas();
  }

  initCanvas() {
    const attach = () => {
      let canvas = document.getElementById('inkVortexCanvas');
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'inkVortexCanvas';
        canvas.style.position = 'fixed';
        canvas.style.inset = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.zIndex = '9999';
        canvas.style.pointerEvents = 'none';
        canvas.style.opacity = '0';
        canvas.style.transition = 'opacity 0.2s ease';
        canvas.style.transform = 'translateZ(0)';
        canvas.style.willChange = 'opacity';
        const target = document.body || document.documentElement;
        if (target) {
          target.appendChild(canvas);
        }
      }
      this.canvas = canvas;
      if (canvas) {
        this.ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
        this.resize();
      }
    };

    if (document.body) {
      attach();
    } else {
      document.addEventListener('DOMContentLoaded', attach);
    }
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.width = this.canvas.width = Math.min(window.innerWidth, 1920);
    this.height = this.canvas.height = Math.min(window.innerHeight, 1080);
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    this.maxRadius = Math.hypot(this.centerX, this.centerY) * 1.12;
  }

  initParticles() {
    this.particles = [];
    const count = 38; // Tinh gọn số lượng hạt để giữ 60 FPS ổn định
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * this.maxRadius * 0.85 + 40;
      this.particles.push({
        angle: angle,
        distance: dist,
        baseSpeed: Math.random() * 0.045 + 0.025,
        radialSpeed: Math.random() * 3.2 + 2.0,
        size: Math.random() * 3.2 + 1.2,
        color: Math.random() > 0.4 ? '#fcd55c' : (Math.random() > 0.5 ? '#a81c22' : '#140f0a'),
        alpha: Math.random() * 0.6 + 0.35
      });
    }
  }

  start(onMidpoint, onComplete) {
    if (this.isActive) return;
    this.isActive = true;
    this.progress = 0;
    this.startTime = performance.now();
    this.onCompleteCallback = onComplete;
    this.midpointFired = false;
    this.resize();
    this.initParticles();

    this.canvas.style.pointerEvents = 'auto';
    this.canvas.style.opacity = '1';

    if (window.audio && typeof window.audio.playDrum === 'function') {
      window.audio.playDrum();
    }

    // Timer dự phòng bảo đảm đổi cảnh không bao giờ bị nghẽn
    this.midpointTimer = setTimeout(() => {
      if (!this.midpointFired && this.isActive) {
        this.midpointFired = true;
        if (typeof onMidpoint === 'function') onMidpoint();
      }
    }, this.duration * 0.5);

    this.finishTimer = setTimeout(() => {
      if (this.isActive) {
        this.finish();
      }
    }, this.duration + 40);

    const animate = (now) => {
      if (!this.isActive) return;
      const elapsed = now - this.startTime;
      this.progress = Math.min(1, elapsed / this.duration);

      this.render(this.progress);

      if (this.progress >= 0.5 && !this.midpointFired) {
        this.midpointFired = true;
        if (typeof onMidpoint === 'function') {
          onMidpoint();
        }
      }

      if (this.progress < 1) {
        this.animId = requestAnimationFrame(animate);
      } else {
        this.finish();
      }
    };

    this.animId = requestAnimationFrame(animate);
  }

  render(p) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const cx = this.centerX;
    const cy = this.centerY;

    ctx.clearRect(0, 0, w, h);

    let vortexIntensity = 0;
    let fadeOut = 0;

    if (p < 0.5) {
      vortexIntensity = p / 0.5; // 0 -> 1
    } else {
      vortexIntensity = 1;
      fadeOut = (p - 0.5) / 0.5; // 0 -> 1
    }

    ctx.save();

    // 1. Nền màn tối loang nhanh
    const bgOpacity = p < 0.5 ? p * 2.0 : 1 - (p - 0.5) * 2.0;
    if (bgOpacity > 0.01) {
      ctx.fillStyle = `rgba(12, 9, 7, ${Math.min(0.98, bgOpacity * 1.05)})`;
      ctx.fillRect(0, 0, w, h);
    }

    // 2. Các nhánh lốc xoáy mực tàu (Step size 30px siêu mượt & nhẹ)
    const spinAngle = p * 10.5;
    const currentMaxR = this.maxRadius * Math.min(1.2, vortexIntensity * 1.35);

    for (let arm = 0; arm < this.arms; arm++) {
      const armOffset = (arm * Math.PI * 2) / this.arms;
      ctx.beginPath();

      for (let r = 16; r <= currentMaxR; r += 30) {
        const curve = Math.pow(r / currentMaxR, 0.72) * 4.6;
        const theta = spinAngle + armOffset + curve;
        const x = cx + Math.cos(theta) * r;
        const y = cy + Math.sin(theta) * r;

        if (r === 16) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      // Tô mực tàu sẫm & son chu sa (Tận dụng màu tĩnh không cấp phát gradient)
      ctx.strokeStyle = (arm % 2 === 0) ? '#0a0806' : '#6b1812';
      ctx.lineWidth = 36 + vortexIntensity * 60;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = Math.max(0, (1 - fadeOut) * 0.88);
      ctx.stroke();
    }

    // 3. Tâm lốc xoáy mực đen
    const eyeRadius = Math.max(20, currentMaxR * 0.35 * vortexIntensity);
    ctx.fillStyle = '#050403';
    ctx.globalAlpha = Math.max(0, (1 - fadeOut) * 0.95);
    ctx.beginPath();
    ctx.arc(cx, cy, eyeRadius, 0, Math.PI * 2);
    ctx.fill();

    // 4. Bụi vàng & tàn chu sa
    ctx.globalCompositeOperation = 'lighter';
    const pLen = this.particles.length;
    for (let i = 0; i < pLen; i++) {
      const pt = this.particles[i];
      pt.angle += pt.baseSpeed * (1 + vortexIntensity * 3.0);
      pt.distance -= pt.radialSpeed * (1 + vortexIntensity * 2.0);

      if (pt.distance < 15) {
        pt.distance = this.maxRadius * (0.6 + Math.random() * 0.35);
      }

      const px = cx + Math.cos(pt.angle) * pt.distance;
      const py = cy + Math.sin(pt.angle) * pt.distance;

      ctx.fillStyle = pt.color;
      ctx.globalAlpha = pt.alpha * (1 - fadeOut);
      ctx.beginPath();
      ctx.arc(px, py, pt.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // ===================================================================
  // HIỆU ỨNG THẾ GIỚI TAN BIẾN THÀNH MỰC (INK DISSOLVE TRANSITION)
  // Dùng khi người chơi nhấn "Quay Lại Bảo Tàng" từ các thế giới riêng
  // ===================================================================
  initDissolveParticles() {
    this.particles = [];
    const count = 52;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4.5 + 2.0;
      this.particles.push({
        x: this.centerX + (Math.random() - 0.5) * (this.width * 0.7),
        y: this.centerY + (Math.random() - 0.5) * (this.height * 0.7),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 28 + 14,
        maxRadius: Math.random() * 120 + 60,
        color: Math.random() > 0.4 ? '#0c0806' : (Math.random() > 0.5 ? '#6b1812' : '#d4af37'),
        alpha: Math.random() * 0.7 + 0.3
      });
    }
  }

  startDissolve(onMidpoint, onComplete) {
    if (this.isActive) return;
    this.isActive = true;
    this.mode = 'dissolve';
    this.progress = 0;
    this.startTime = performance.now();
    this.onCompleteCallback = onComplete;
    this.midpointFired = false;
    this.resize();
    this.initDissolveParticles();

    this.canvas.style.pointerEvents = 'auto';
    this.canvas.style.opacity = '1';

    if (window.audio) {
      if (typeof window.audio.playBell === 'function') {
        window.audio.playBell();
      } else if (typeof window.audio.playPaper === 'function') {
        window.audio.playPaper();
      }
    }

    this.midpointTimer = setTimeout(() => {
      if (!this.midpointFired && this.isActive) {
        this.midpointFired = true;
        if (typeof onMidpoint === 'function') onMidpoint();
      }
    }, this.duration * 0.5);

    this.finishTimer = setTimeout(() => {
      if (this.isActive) {
        this.finish();
      }
    }, this.duration + 40);

    const animate = (now) => {
      if (!this.isActive) return;
      const elapsed = now - this.startTime;
      this.progress = Math.min(1, elapsed / this.duration);

      this.renderDissolve(this.progress);

      if (this.progress >= 0.5 && !this.midpointFired) {
        this.midpointFired = true;
        if (typeof onMidpoint === 'function') {
          onMidpoint();
        }
      }

      if (this.progress < 1) {
        this.animId = requestAnimationFrame(animate);
      } else {
        this.finish();
      }
    };

    this.animId = requestAnimationFrame(animate);
  }

  renderDissolve(p) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);
    ctx.save();

    // 1. Lớp màn tối loang nhanh bao phủ thế giới cũ
    let bgAlpha = 0;
    if (p < 0.5) {
      bgAlpha = (p / 0.5) * 0.98;
    } else {
      bgAlpha = (1 - (p - 0.5) / 0.5) * 0.98;
    }

    if (bgAlpha > 0.01) {
      ctx.fillStyle = `rgba(14, 10, 7, ${bgAlpha})`;
      ctx.fillRect(0, 0, w, h);
    }

    // 2. Các đốm mực loang nở rộng và tan biến
    const pLen = this.particles.length;
    for (let i = 0; i < pLen; i++) {
      const pt = this.particles[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      const currentRadius = p < 0.5
        ? pt.radius + (pt.maxRadius - pt.radius) * (p / 0.5)
        : pt.maxRadius * (1 - (p - 0.5) / 0.5);

      const fade = p < 0.5 ? p / 0.5 : 1 - (p - 0.5) / 0.5;

      ctx.fillStyle = pt.color;
      ctx.globalAlpha = Math.max(0, pt.alpha * fade * 0.92);
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, Math.max(1, currentRadius), 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Vòng triện "Vạn Tượng Quy Nhất" lóe sáng ở khoảnh khắc giao thoa
    if (p >= 0.35 && p <= 0.75) {
      const sealFade = Math.sin(((p - 0.35) / 0.4) * Math.PI);
      ctx.fillStyle = '#fcd55c';
      ctx.globalAlpha = sealFade * 0.85;
      ctx.font = 'bold 36px "Playfair Display", "Lora", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('❖ QUY VỀ BẢO TÀNG ❖', this.centerX, this.centerY);
    }

    ctx.restore();
  }

  finish() {
    if (this.midpointTimer) {
      clearTimeout(this.midpointTimer);
      this.midpointTimer = null;
    }
    if (this.finishTimer) {
      clearTimeout(this.finishTimer);
      this.finishTimer = null;
    }
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    this.isActive = false;
    if (this.canvas) {
      this.canvas.style.opacity = '0';
      this.canvas.style.pointerEvents = 'none';
      setTimeout(() => {
        if (this.ctx) this.ctx.clearRect(0, 0, this.width, this.height);
      }, 200);
    }
    if (typeof this.onCompleteCallback === 'function') {
      this.onCompleteCallback();
      this.onCompleteCallback = null;
    }
  }
}

// Khởi tạo singleton toàn cục
window.vtInkVortex = new InkVortexTransition();
window.inkVortex = window.vtInkVortex;
