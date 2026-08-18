/* ============================================================
   Nasim Mahmud Nayan — Portfolio interactions
   ============================================================ */
(function () {
  'use strict';

  /* mark JS active so reveal elements start hidden (and stay visible if JS never runs) */
  document.documentElement.classList.add('js');

  /* ---------- scroll reveal ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const el = e.target;
          el.classList.add('in');
          io.unobserve(el);
          // once the entrance has played, drop the animation so snapshot/
          // print renders rest at the plain visible base state
          el.addEventListener('animationend', () => el.classList.add('done'), { once: true });
          // safety: mark done even if animationend never fires
          setTimeout(() => el.classList.add('done'), 1300);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((r) => io.observe(r));
  } else {
    reveals.forEach((r) => { r.classList.add('in'); r.classList.add('done'); });
  }

  /* ---------- animated counters ----------
     Markup variants handled:
       <div data-count="13">13</div>
       <div data-count="4"><span data-num>4</span><span class="suf">+</span></div>
       <div data-count="21000">21k<span class="suf">+</span></div>
     The accent ".suf" span (e.g. "+") is never touched. */
  function animateCount(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const isK = target >= 1000;
    const dur = 1400;
    const start = performance.now();
    const numSpan = el.querySelector('[data-num]');
    const writeVal = (txt) => {
      if (numSpan) numSpan.textContent = txt;
      else if (el.firstChild && el.firstChild.nodeType === 3) el.firstChild.nodeValue = txt;
      else el.textContent = txt;
    };
    const fmt = (v) => isK
      ? (Math.round(v / 100) / 10).toString().replace(/\.0$/, '') + 'k'
      : Math.round(v).toString();
    function frame(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      writeVal(fmt(target * eased));
      if (p < 1) requestAnimationFrame(frame);
      else writeVal(fmt(target));
    }
    requestAnimationFrame(frame);
  }

  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach((c) => co.observe(c));
  }

  /* ---------- nav: scrolled state + active section ---------- */
  const nav = document.getElementById('nav');
  const navLinks = Array.from(document.querySelectorAll('#navlinks a[href^="#"]'));
  const sections = Array.from(document.querySelectorAll('[data-section]'));

  function onScroll() {
    if (window.scrollY > 12) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if ('IntersectionObserver' in window) {
    const so = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = e.target.getAttribute('data-section');
          navLinks.forEach((l) => {
            l.classList.toggle('active', l.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => so.observe(s));
  }

  /* ---------- mobile menu ---------- */
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navlinks');
  if (toggle && links) {
    const setOpen = (open) => {
      links.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    setOpen(false);
    toggle.addEventListener('click', () => setOpen(!links.classList.contains('open')));
    links.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => setOpen(false))
    );
  }

  /* ---------- publication filter ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const pubs = document.querySelectorAll('.pub');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      const f = btn.getAttribute('data-filter');
      pubs.forEach((p) => {
        const tags = p.getAttribute('data-tags') || '';
        const show = f === 'all' || tags.indexOf(f) !== -1;
        p.style.display = show ? '' : 'none';
      });
    });
  });

})();
