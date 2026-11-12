// Mobile navigation.
const closeButton = document.querySelector('.close-button');
const overlay = document.querySelector('.mobile-overlay');
const hamburgerButton = document.querySelector('.hamburger-button');
if (hamburgerButton && overlay && closeButton) {
  hamburgerButton.addEventListener('click', () => overlay.classList.add('overlay-open'));
  closeButton.addEventListener('click', () => overlay.classList.remove('overlay-open'));
}

// Home gallery.
const container = document.querySelector('.gallery-slide');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');
if (container && nextBtn && prevBtn) {
  nextBtn.addEventListener('click', () => container.scrollBy({ left: 300, behavior: 'smooth' }));
  prevBtn.addEventListener('click', () => container.scrollBy({ left: -300, behavior: 'smooth' }));
}

// Automatic leftward slide motion with small manual controls.
const images = [...document.querySelectorAll('.info-carousel-image')];
if (images.length) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let timer;
  let switching = false;
  images.forEach((image, i) => image.classList.toggle('active', i === 0));
  const schedule = () => {
    clearTimeout(timer);
    if (!document.hidden && !switching) timer = setTimeout(() => advance(1, -1), 6000);
  };
  async function advance(step, direction) {
    if (switching || document.hidden) return;
    clearTimeout(timer);
    switching = true;
    const index = (current + step + images.length) % images.length;
    const incoming = images[index];
    const outgoing = images[current];
    try {
      if (incoming.decode) await incoming.decode();
      if (document.hidden) return;
      incoming.classList.add('active');
      if (!reducedMotion.matches && incoming.animate) {
        const options = { duration: 850, easing: 'cubic-bezier(.65,0,.35,1)' };
        const enter = incoming.animate([
          { transform: `translateX(${-direction * 100}%)` },
          { transform: 'translateX(0%)' }
        ], options);
        const leave = outgoing.animate([
          { transform: 'translateX(0%)' },
          { transform: `translateX(${direction * 100}%)` }
        ], options);
        await Promise.allSettled([enter.finished, leave.finished]);
      }
      outgoing.classList.remove('active');
      current = index;
    } catch {
      incoming.classList.remove('active');
      outgoing.classList.add('active');
    } finally {
      switching = false;
      schedule();
    }
  }
  document.querySelector('.prev-info')?.addEventListener('click', () => advance(-1, 1));
  document.querySelector('.next-info')?.addEventListener('click', () => advance(1, -1));
  document.addEventListener('visibilitychange', schedule);
  schedule();
}
