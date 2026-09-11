(() => {
  'use strict';

  const START = new Date('2023-11-16T00:00:00+05:30');
  const LONG_DISTANCE_START = new Date('2026-09-19T00:00:00+05:30');
  const REUNION = new Date('2026-11-19T00:00:00+05:30');
  const ANNIVERSARY = '2026-11-16';

  const $ = (id) => document.getElementById(id);
  const pad = (n) => String(n).padStart(2, '0');

  // Relationship duration using calendar-aware years/months/days.
  function relationshipDuration(now) {
    let cursor = new Date(START);
    let years = 0, months = 0;
    while (true) {
      const next = new Date(cursor);
      next.setFullYear(next.getFullYear() + 1);
      if (next <= now) { years++; cursor = next; } else break;
    }
    while (true) {
      const next = new Date(cursor);
      next.setMonth(next.getMonth() + 1);
      if (next <= now) { months++; cursor = next; } else break;
    }
    const ms = Math.max(0, now - cursor);
    const days = Math.floor(ms / 86400000);
    const hours = Math.floor((ms % 86400000) / 3600000);
    return {years, months, days, hours};
  }

  function updateTimers() {
    const now = new Date();
    const d = relationshipDuration(now);
    $('yearsTogether').textContent = d.years;
    $('monthsTogether').textContent = d.months;
    $('daysTogether').textContent = d.days;
    $('hoursTogether').textContent = d.hours;

    let diff = Math.max(0, REUNION - now);
    const days = Math.floor(diff / 86400000); diff %= 86400000;
    const hours = Math.floor(diff / 3600000); diff %= 3600000;
    const minutes = Math.floor(diff / 60000); diff %= 60000;
    const seconds = Math.floor(diff / 1000);
    $('daysLeft').textContent = pad(days);
    $('hoursLeft').textContent = pad(hours);
    $('minutesLeft').textContent = pad(minutes);
    $('secondsLeft').textContent = pad(seconds);
  }
  updateTimers();
  setInterval(updateTimers, 1000);

  // Calendar: September, October, November 2026.
  const monthNames = ['September', 'October', 'November'];
  const monthIndexes = [8, 9, 10];
  const weekdays = ['S','M','T','W','T','F','S'];
  const monthsEl = $('months');
  const now = new Date();
  monthIndexes.forEach((m, idx) => {
    const card = document.createElement('section');
    card.className = 'month';
    const title = document.createElement('h3');
    title.textContent = `${monthNames[idx]} 2026`;
    card.appendChild(title);
    const week = document.createElement('div');
    week.className = 'weekdays';
    weekdays.forEach(w => { const s = document.createElement('span'); s.textContent = w; week.appendChild(s); });
    card.appendChild(week);
    const daysGrid = document.createElement('div');
    daysGrid.className = 'days';
    const first = new Date(2026, m, 1).getDay();
    const total = new Date(2026, m + 1, 0).getDate();
    for (let i=0;i<first;i++) { const e=document.createElement('span'); e.className='day empty'; daysGrid.appendChild(e); }
    for (let day=1;day<=total;day++) {
      const cell = document.createElement('span');
      cell.className = 'day';
      cell.textContent = day;
      const iso = `2026-${pad(m+1)}-${pad(day)}`;
      const date = new Date(`2026-${pad(m+1)}-${pad(day)}T23:59:59+05:30`);
      if (date < now) cell.classList.add('passed');
      if (date >= LONG_DISTANCE_START && date <= REUNION) cell.classList.add('in-distance');
      if (iso === ANNIVERSARY) {
        cell.classList.add('anniversary');
        cell.title = 'Our anniversary — 16 November';
      }
      if (iso === '2026-11-19') {
        cell.classList.add('reunion');
        cell.title = 'Together again — 19 November';
      }
      daysGrid.appendChild(cell);
    }
    card.appendChild(daysGrid);
    if (m === 10) {
      const label = document.createElement('div');
      label.className = 'special-label';
      label.innerHTML = '16 Nov — our anniversary ♡ &nbsp;&nbsp; • &nbsp;&nbsp; 19 Nov — together again ♥';
      card.appendChild(label);
    }
    monthsEl.appendChild(card);
  });

  // Sketchbook memories.
  const memories = [
    ['product-1.webp', 'You. Always.', 'With you, every ordinary day feels special.'],
    ['product-2.webp', 'My favourite place.', 'I could look at you for a lifetime and still find something new to love.'],
    ['product-3.webp', 'Little prayers, big love.', 'Some memories feel like blessings we get to keep forever.'],
    ['product-4.webp', 'Just us.', 'No matter where life takes us, you will always feel like home to me.'],
    ['product-5.webp', 'Our silly days.', 'I love the quiet version of us just as much as the loud, laughing one.'],
    ['product-6.webp', 'One more memory.', 'If I had to choose again, in every lifetime, I would still choose you.'],
    ['product-7.webp', 'Side by side.', 'Different places, different days — same hearts, same us.'],
    ['product-8.webp', 'Us, under the same sky.', 'Every road with you becomes a memory I never want to forget.'],
    ['product-9.webp', 'A page I keep close.', 'You make love feel soft, safe, and wonderfully simple.'],
    ['product-10.webp', 'Still my favourite.', 'Two months apart cannot undo all the days that taught my heart your name.']
  ];
  let current = 0;
  const photo = $('memoryPhoto');
  const caption = $('memoryCaption');
  const quote = $('memoryQuote');
  const pageIndex = $('pageIndex');
  const book = $('book');
  const bookWrap = $('bookWrap');

  function showMemory(index, direction=1) {
    current = (index + memories.length) % memories.length;
    book.classList.remove('page-turn');
    void book.offsetWidth;
    book.classList.add('page-turn');
    bookWrap.style.transform = `rotateY(${direction > 0 ? '-2deg' : '2deg'}) rotateX(1deg)`;
    setTimeout(() => {
      const [src, cap, q] = memories[current];
      photo.src = `assets/moments/${src}`;
      caption.textContent = cap;
      quote.textContent = q;
      pageIndex.textContent = pad(current + 1);
      setTimeout(() => bookWrap.style.transform = 'rotateY(0) rotateX(0)', 80);
    }, 220);
  }
  $('nextPage').addEventListener('click', () => showMemory(current+1, 1));
  $('prevPage').addEventListener('click', () => showMemory(current-1, -1));
  let touchStartX = 0;
  $('bookStage').addEventListener('touchstart', e => touchStartX = e.changedTouches[0].clientX, {passive:true});
  $('bookStage').addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 45) showMemory(current + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  }, {passive:true});

  // Reveal animation and right-side progress rail.
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, {threshold:.16});
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  const sections = [...document.querySelectorAll('.panel')];
  const railLinks = [...document.querySelectorAll('.rail a')];
  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const idx = sections.indexOf(entry.target);
      railLinks.forEach((a,i) => a.classList.toggle('active', i===idx));
    });
  }, {threshold:.58});
  sections.forEach(s => sectionObs.observe(s));

  // Three.js: subtle floating dust / warm particles behind the page.
  if (window.THREE) {
    const canvas = $('cinematicCanvas');
    const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, innerWidth/innerHeight, .1, 100);
    camera.position.z = 8;
    const count = innerWidth < 700 ? 75 : 140;
    const positions = new Float32Array(count*3);
    for (let i=0;i<count;i++) {
      positions[i*3] = (Math.random()-.5)*14;
      positions[i*3+1] = (Math.random()-.5)*10;
      positions[i*3+2] = (Math.random()-.5)*7;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({size:.035, color:0xe6b39e, transparent:true, opacity:.5, depthWrite:false});
    const dust = new THREE.Points(geo, mat);
    scene.add(dust);
    function resize(){renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}
    addEventListener('resize',resize);resize();
    let mouseX=0, mouseY=0;
    addEventListener('pointermove',e=>{mouseX=(e.clientX/innerWidth-.5);mouseY=(e.clientY/innerHeight-.5)});
    function animate(t){
      requestAnimationFrame(animate);
      dust.rotation.y = t*.000025 + mouseX*.07;
      dust.rotation.x = Math.sin(t*.00013)*.035 + mouseY*.04;
      const pos = geo.attributes.position.array;
      for(let i=0;i<count;i++){pos[i*3+1]+=0.00065;if(pos[i*3+1]>5) pos[i*3+1]=-5;}
      geo.attributes.position.needsUpdate=true;
      renderer.render(scene,camera);
    }
    requestAnimationFrame(animate);
  }
})();
