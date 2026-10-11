export const ORNAMENT_SPEED = 3;
const RECOVERY_SECONDS = 1.1;

export function angleDelta(from: number, to: number) {
  return ((to - from + 540) % 360 + 360) % 360 - 180;
}

export function advanceRotation(angle: number, speed: number, seconds: number) {
  const decay = Math.exp(-seconds / RECOVERY_SECONDS);
  return {
    angle: angle + ORNAMENT_SPEED * seconds + (speed - ORNAMENT_SPEED) * RECOVERY_SECONDS * (1 - decay),
    speed: ORNAMENT_SPEED + (speed - ORNAMENT_SPEED) * decay,
  };
}

export function releaseSpeed(speed: number, idleSeconds: number) {
  return speed * Math.exp(-Math.max(0, idleSeconds - 0.04) / 0.045);
}

export function initOrnamentMotion() {
  const root = document.documentElement;
  const control = document.querySelector<HTMLButtonElement>('#site-surface .ornament-control');
  if (!control || control.dataset.ornamentReady) return;
  control.dataset.ornamentReady = 'true';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let angle = 0;
  let speed = ORNAMENT_SPEED;
  let frame = 0;
  let lastFrame: number | undefined;
  let pointer: number | undefined;
  let pointerAngle = 0;
  let sampledAt = 0;
  let movedAt = 0;

  const expressive = () => root.dataset.style === 'expressive' || root.classList.contains('style-preview');
  const interactive = () => expressive() && root.dataset.heroDocked !== 'true' && !document.hidden;
  const animated = () => expressive() && !reducedMotion.matches && !document.hidden;
  const render = () => root.style.setProperty('--ornament-angle', `${angle % 360}deg`);
  const readAngle = (event: PointerEvent) => {
    const rect = control.getBoundingClientRect();
    return Math.atan2(event.clientY - rect.y - rect.height / 2, event.clientX - rect.x - rect.width / 2) * 180 / Math.PI;
  };

  function stopFrame() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastFrame = undefined;
  }

  function tick(now: number) {
    frame = 0;
    if (!animated() || pointer !== undefined) return;
    if (lastFrame !== undefined) {
      ({angle, speed} = advanceRotation(angle, speed, (now - lastFrame) / 1000));
      render();
    }
    lastFrame = now;
    frame = requestAnimationFrame(tick);
  }

  function startFrame() {
    if (animated() && pointer === undefined && !frame) frame = requestAnimationFrame(tick);
  }

  function finishDrag(inertia: boolean) {
    if (pointer === undefined) return;
    const captured = pointer;
    pointer = undefined;
    delete root.dataset.ornamentDragging;
    speed = inertia && !reducedMotion.matches ? releaseSpeed(speed, (performance.now() - movedAt) / 1000) : ORNAMENT_SPEED;
    if (control!.hasPointerCapture(captured)) {
      try { control!.releasePointerCapture(captured); } catch {}
    }
  }

  function sync() {
    stopFrame();
    control!.tabIndex = interactive() && root.dataset.style === 'expressive' ? 0 : -1;
    if (!interactive()) finishDrag(false);
    if (reducedMotion.matches || document.hidden) speed = ORNAMENT_SPEED;
    startFrame();
  }

  control.addEventListener('pointerdown', event => {
    if (!interactive() || !event.isPrimary || event.button !== 0 || pointer !== undefined) return;
    const rect = control.getBoundingClientRect();
    const radius = Math.hypot((event.clientX - rect.x - rect.width / 2) / rect.width, (event.clientY - rect.y - rect.height / 2) / rect.height);
    if (radius < 0.22 || radius > 0.5) return;
    if (root.classList.contains('style-preview')) {
      const split = Number(document.getElementById('style-divider')?.getAttribute('aria-valuenow') ?? 50);
      if (event.clientX > root.clientWidth * split / 100) return;
    }
    stopFrame();
    pointer = event.pointerId;
    pointerAngle = readAngle(event);
    sampledAt = movedAt = performance.now();
    speed = 0;
    root.dataset.ornamentDragging = 'true';
    control.setPointerCapture(pointer);
  });

  control.addEventListener('pointermove', event => {
    if (event.pointerId !== pointer) return;
    if (!interactive()) { finishDrag(false); startFrame(); return; }
    const now = performance.now();
    const nextAngle = readAngle(event);
    const delta = angleDelta(pointerAngle, nextAngle);
    const seconds = (now - sampledAt) / 1000;
    angle += delta;
    if (Math.abs(delta) > 0.01 && seconds > 0) {
      const sampleSpeed = Math.max(-720, Math.min(720, delta / seconds));
      speed += (sampleSpeed - speed) * (1 - Math.exp(-seconds / 0.035));
      movedAt = now;
    }
    sampledAt = now;
    pointerAngle = nextAngle;
    render();
  });

  const release = (event: PointerEvent) => {
    if (event.pointerId !== pointer) return;
    finishDrag(event.type === 'pointerup');
    startFrame();
  };
  control.addEventListener('pointerup', release);
  control.addEventListener('pointercancel', release);
  control.addEventListener('lostpointercapture', release);
  control.addEventListener('keydown', event => {
    if (!interactive() || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    angle += event.key === 'ArrowRight' ? 15 : -15;
    speed = ORNAMENT_SPEED;
    render();
  });
  new MutationObserver(sync).observe(root, {attributes: true, attributeFilter: ['data-style', 'class', 'data-hero-docked']});
  reducedMotion.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  render();
  sync();
}
