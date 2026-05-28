(function () {
  // ── Canvas ────────────────────────────────────────────────────────────────
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
  document.body.insertBefore(canvas, document.body.firstChild);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // ── Simulation parameters ─────────────────────────────────────────────────
  const N    = 128;    // grid cells per axis
  const ITER = 4;      // pressure-solver iterations
  const VISC = 1e-7;   // viscosity (near-zero = smoke in air)
  const DIFF = 4e-6;   // smoke diffusion rate
  const DT   = 0.13;   // timestep

  const W  = N + 2;
  const SZ = W * W;
  const IX = (x, y) => x + W * y;

  // ── Fields ────────────────────────────────────────────────────────────────
  let vx  = new Float32Array(SZ), vy  = new Float32Array(SZ);
  let vx0 = new Float32Array(SZ), vy0 = new Float32Array(SZ);
  let den = new Float32Array(SZ), den0= new Float32Array(SZ);

  // ── Offscreen pixel buffer (N×N, scaled to full screen each frame) ────────
  const off    = document.createElement('canvas');
  off.width = off.height = N;
  const offCtx = off.getContext('2d');
  const img    = offCtx.createImageData(N, N);
  const px     = img.data;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  // ── Core fluid solver (Stable Fluids — Jos Stam 1999) ────────────────────
  function setBnd(b, x) {
    for (let i = 1; i <= N; i++) {
      x[IX(0,     i)] = b === 1 ? -x[IX(1, i)] : x[IX(1, i)];
      x[IX(N + 1, i)] = b === 1 ? -x[IX(N, i)] : x[IX(N, i)];
      x[IX(i,     0)] = b === 2 ? -x[IX(i, 1)] : x[IX(i, 1)];
      x[IX(i, N + 1)] = b === 2 ? -x[IX(i, N)] : x[IX(i, N)];
    }
    x[IX(0,     0    )] = .5 * (x[IX(1, 0)]     + x[IX(0, 1)]);
    x[IX(0,     N + 1)] = .5 * (x[IX(1, N + 1)] + x[IX(0, N)]);
    x[IX(N + 1, 0    )] = .5 * (x[IX(N, 0)]     + x[IX(N + 1, 1)]);
    x[IX(N + 1, N + 1)] = .5 * (x[IX(N, N + 1)] + x[IX(N + 1, N)]);
  }

  function linSolve(b, x, x0, a, c) {
    const inv = 1 / c;
    for (let k = 0; k < ITER; k++) {
      for (let j = 1; j <= N; j++)
        for (let i = 1; i <= N; i++)
          x[IX(i, j)] = (x0[IX(i, j)] + a * (
            x[IX(i - 1, j)] + x[IX(i + 1, j)] +
            x[IX(i, j - 1)] + x[IX(i, j + 1)]
          )) * inv;
      setBnd(b, x);
    }
  }

  function diffuse(b, x, x0, diff) {
    const a = DT * diff * N * N;
    linSolve(b, x, x0, a, 1 + 4 * a);
  }

  function advect(b, dst, src, u, v) {
    const dt0 = DT * N;
    for (let j = 1; j <= N; j++) {
      for (let i = 1; i <= N; i++) {
        const ax = Math.max(0.5, Math.min(N + 0.5, i - dt0 * u[IX(i, j)]));
        const ay = Math.max(0.5, Math.min(N + 0.5, j - dt0 * v[IX(i, j)]));
        const i0 = ax | 0, i1 = i0 + 1;
        const j0 = ay | 0, j1 = j0 + 1;
        const s1 = ax - i0, s0 = 1 - s1;
        const t1 = ay - j0, t0 = 1 - t1;
        dst[IX(i, j)] = s0 * (t0 * src[IX(i0, j0)] + t1 * src[IX(i0, j1)]) +
                        s1 * (t0 * src[IX(i1, j0)] + t1 * src[IX(i1, j1)]);
      }
    }
    setBnd(b, dst);
  }

  function project(u, v, p, div) {
    const h = 1 / N, inv2h = N * 0.5;
    for (let j = 1; j <= N; j++) for (let i = 1; i <= N; i++) {
      div[IX(i, j)] = -h * 0.5 * (u[IX(i+1,j)] - u[IX(i-1,j)] + v[IX(i,j+1)] - v[IX(i,j-1)]);
      p[IX(i, j)]   = 0;
    }
    setBnd(0, div); setBnd(0, p);
    linSolve(0, p, div, 1, 4);
    for (let j = 1; j <= N; j++) for (let i = 1; i <= N; i++) {
      u[IX(i, j)] -= inv2h * (p[IX(i + 1, j)] - p[IX(i - 1, j)]);
      v[IX(i, j)] -= inv2h * (p[IX(i, j + 1)] - p[IX(i, j - 1)]);
    }
    setBnd(1, u); setBnd(2, v);
  }

  function step() {
    let tmp;

    // Add external forces to velocity and density
    for (let i = 0; i < SZ; i++) {
      vx[i]  += DT * vx0[i];
      vy[i]  += DT * vy0[i];
      den[i] += DT * den0[i];
    }
    vx0.fill(0); vy0.fill(0); den0.fill(0);

    // Velocity: diffuse → project → advect → project
    tmp = vx0; vx0 = vx; vx = tmp;  diffuse(1, vx, vx0, VISC);
    tmp = vy0; vy0 = vy; vy = tmp;  diffuse(2, vy, vy0, VISC);
    project(vx, vy, vx0, vy0);
    tmp = vx0; vx0 = vx; vx = tmp;
    tmp = vy0; vy0 = vy; vy = tmp;
    advect(1, vx, vx0, vx0, vy0);
    advect(2, vy, vy0, vx0, vy0);
    project(vx, vy, vx0, vy0);

    // Density: diffuse → advect → gentle decay
    tmp = den0; den0 = den; den = tmp;  diffuse(0, den, den0, DIFF);
    tmp = den0; den0 = den; den = tmp;  advect(0, den, den0, vx, vy);
    for (let i = 0; i < SZ; i++) den[i] *= 0.9997;
  }

  // ── Mouse ─────────────────────────────────────────────────────────────────
  let mx = 0, my = 0, lmx = 0, lmy = 0;
  document.addEventListener('mousemove', e => {
    lmx = mx; lmy = my;
    mx = e.clientX; my = e.clientY;
  }, { passive: true });

  function applyMouse() {
    const dvx = (mx - lmx) * 14;
    const dvy = (my - lmy) * 14;
    if (Math.abs(dvx) < 0.5 && Math.abs(dvy) < 0.5) return;
    const gx = Math.round(mx / canvas.width  * N) + 1;
    const gy = Math.round(my / canvas.height * N) + 1;
    for (let dj = -3; dj <= 3; dj++) {
      for (let di = -3; di <= 3; di++) {
        const ni = gx + di, nj = gy + dj;
        if (ni < 1 || ni > N || nj < 1 || nj > N) continue;
        const w = 1 / (1 + di * di + dj * dj);
        vx0[IX(ni, nj)] += dvx * w;
        vy0[IX(ni, nj)] += dvy * w;
      }
    }
    lmx = mx; lmy = my;
  }

  // ── Ambient life: buoyancy + turbulence + density replenishment ───────────
  function applyAmbient() {
    for (let j = 1; j <= N; j++)
      for (let i = 1; i <= N; i++)
        vy0[IX(i, j)] -= den[IX(i, j)] * 0.009; // smoke rises

    for (let t = 0; t < 5; t++) {
      const xi = (Math.random() * N | 0) + 1;
      const yi = (Math.random() * N | 0) + 1;
      vx0[IX(xi, yi)] += (Math.random() - 0.5) * 1.0;
      vy0[IX(xi, yi)] += (Math.random() - 0.5) * 1.0;
    }
    for (let t = 0; t < 5; t++) {
      const xi = (Math.random() * N | 0) + 1;
      const yi = (Math.random() * N | 0) + 1;
      den0[IX(xi, yi)] += 0.45;
    }
  }

  // ── Render: density → pixel colour with fake 3D normal-map lighting ───────
  function render() {
    for (let j = 0; j < N; j++) {
      for (let i = 0; i < N; i++) {
        const d = Math.min(1, Math.pow(den[IX(i + 1, j + 1)], 0.6));

        // Gradient of density field → fake surface normal → directional light
        const gnx = den[IX(i + 2, j + 1)] - den[IX(i,     j + 1)];
        const gny = den[IX(i + 1, j + 2)] - den[IX(i + 1, j    )];
        const lit  = Math.max(0, Math.min(1, 0.55 + gnx * 2.0 - gny * 2.5));

        // Composite: ambient + directional
        const v   = d * (0.35 + lit * 0.65);
        const idx = (j * N + i) << 2;

        // Background #0e0e0e (14,14,14) → grey-cool smoke (~155,150,165)
        px[idx]     = 14 + ((v * 141) | 0);
        px[idx + 1] = 14 + ((v * 136) | 0);
        px[idx + 2] = 14 + ((v * 151) | 0);
        px[idx + 3] = 255;
      }
    }
    offCtx.putImageData(img, 0, 0);
    ctx.drawImage(off, 0, 0, canvas.width, canvas.height);
  }

  // ── Initialise ────────────────────────────────────────────────────────────
  for (let j = 1; j <= N; j++) {
    for (let i = 1; i <= N; i++) {
      den[IX(i, j)] = 0.3 + Math.random() * 0.5;
      vx[IX(i, j)]  = (Math.random() - 0.5) * 0.5;
      vy[IX(i, j)]  = (Math.random() - 0.5) * 0.5;
    }
  }
  // Pre-warm the simulation so smoke looks natural from frame 1
  for (let w = 0; w < 40; w++) { applyAmbient(); step(); }

  // ── Main loop ─────────────────────────────────────────────────────────────
  function frame() {
    applyMouse();
    applyAmbient();
    step();
    render();
    requestAnimationFrame(frame);
  }
  frame();
})();
