/* ============================================
   Brewed & Co. — main.js
   Interactions, animations, scroll effects
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. NAVBAR scroll effect ── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── 2. Mobile hamburger / drawer ── */
  const hamburger = document.getElementById('nav-hamburger');
  const drawer    = document.getElementById('nav-drawer');
  const drawerLinks = drawer ? drawer.querySelectorAll('a') : [];

  hamburger?.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    drawer?.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      drawer?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── 3. Scroll-reveal using IntersectionObserver ── */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => revealObs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ── 4. Menu tabs filter ── */
  const tabs = document.querySelectorAll('.menu-tab');
  const cards = document.querySelectorAll('.menu-card[data-category]');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const cat = tab.dataset.tab;
      cards.forEach(card => {
        const match = cat === 'all' || card.dataset.category === cat;
        card.style.display = match ? '' : 'none';
        if (match) {
          card.style.animation = 'none';
          card.offsetHeight; // reflow
          card.style.animation = 'fadeUp 0.5s ease forwards';
        }
      });
    });
  });

  /* ── 5. Testimonials carousel ── */
  const track = document.querySelector('.testimonials-track');
  const dots  = document.querySelectorAll('.t-dot');
  let current = 0;
  let autoPlay;

  function getVisible() {
    if (window.innerWidth < 768)  return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  function totalSlides() {
    const count = track ? track.children.length : 0;
    const vis = getVisible();
    return Math.max(0, count - vis + 1);
  }

  function goTo(idx) {
    if (!track) return;
    const vis = getVisible();
    const card = track.children[0];
    if (!card) return;
    const cardW = card.offsetWidth + 24; // gap = 1.5rem ≈ 24px
    const maxIdx = totalSlides() - 1;
    current = Math.max(0, Math.min(idx, maxIdx));
    track.style.transform = `translateX(-${current * cardW}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  dots.forEach((dot, i) => dot.addEventListener('click', () => {
    goTo(i);
    resetAutoPlay();
  }));

  function resetAutoPlay() {
    clearInterval(autoPlay);
    autoPlay = setInterval(() => goTo((current + 1) % Math.max(1, totalSlides())), 5000);
  }

  if (track) {
    goTo(0);
    resetAutoPlay();
    window.addEventListener('resize', () => goTo(0));
  }

  /* ── 6. Animated counter for About stats ── */
  const statVals = document.querySelectorAll('.stat-val[data-target]');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const step = 16;
      const increment = target / (duration / step);
      let current = 0;

      const timer = setInterval(() => {
        current = Math.min(current + increment, target);
        el.textContent = Math.floor(current) + suffix;
        if (current >= target) clearInterval(timer);
      }, step);

      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  statVals.forEach(el => counterObs.observe(el));

  /* ── 7. Reservation form ── */
  const resForm  = document.getElementById('reservation-form');
  const resToast = document.getElementById('form-toast');

  resForm?.addEventListener('submit', e => {
    e.preventDefault();
    const btn = resForm.querySelector('.form-submit');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'Reserve My Table';
      resToast?.classList.add('show');
      resForm.reset();
      setTimeout(() => resToast?.classList.remove('show'), 5000);
    }, 1400);
  });

  /* ── 8. Smooth scroll for in-page links ── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── 9. Add to cart micro interaction ── */
  document.querySelectorAll('.menu-card-add').forEach(btn => {
    btn.addEventListener('click', function () {
      this.textContent = '✓';
      this.style.background = 'linear-gradient(135deg, #4aad4a, #2d8c2d)';
      this.style.color = '#fff';
      this.style.borderColor = 'transparent';
      setTimeout(() => {
        this.textContent = '+';
        this.style.background = '';
        this.style.color = '';
        this.style.borderColor = '';
      }, 1500);
    });
  });

});
