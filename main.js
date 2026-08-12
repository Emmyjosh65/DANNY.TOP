/* ═══ DANNY.TOP — main.js ═══ */

// --- helpers ---
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

// --- year ---
$('#year').textContent = new Date().getFullYear();

// --- live clock (UK = UTC+0; change TZ_OFFSET_MIN if needed) ---
const TZ_OFFSET_MIN = 0; // UK: 0 | UTC+5:30: 330 | UTC-5: -300
function tick() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const local = new Date(utc + TZ_OFFSET_MIN * 60000);
  $('#clock').textContent = local.toLocaleTimeString('en-GB');
}
tick(); setInterval(tick, 1000);

// --- navbar scroll + mobile menu ---
const navbar = $('#navbar');
addEventListener('scroll', () => navbar.classList.toggle('scrolled', scrollY > 10));
$('#hamburger').addEventListener('click', () => $('#nav-links').classList.toggle('open'));
$$('#nav-links a').forEach(a => a.addEventListener('click', () => $('#nav-links').classList.remove('open')));

// --- typing effect (same tagline style as original) ---
const phrases = ['WhatsApp Bots 🤖', 'Web Platforms 🌐', 'Cloud Systems ☁️', 'Automation Scripts ⚡', 'Scalable APIs 🔧'];
const typed = $('#typed-text');
let p = 0, i = 0, deleting = false;
(function typeLoop() {
  const word = phrases[p];
  typed.textContent = word.slice(0, i);
  if (!deleting && i < word.length) { i++; setTimeout(typeLoop, 65); }
  else if (!deleting) { deleting = true; setTimeout(typeLoop, 1600); }
  else if (i > 0) { i--; setTimeout(typeLoop, 35); }
  else { deleting = false; p = (p + 1) % phrases.length; setTimeout(typeLoop, 350); }
})();

// --- reveal on scroll ---
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('visible')), { threshold: .12 });
$$('.reveal').forEach(el => io.observe(el));

// --- counters (5 years / 4 projects / 25 clients) ---
const cio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, target = parseInt(el.dataset.target) || 0;
  let n = 0;
  const step = Math.max(1, Math.ceil(target / 60));
  const iv = setInterval(() => { n = Math.min(target, n + step); el.textContent = n; if (n >= target) clearInterval(iv); }, 28);
  cio.unobserve(el);
}), { threshold: .6 });
$$('.counter').forEach(c => cio.observe(c));

// --- skill bars ---
const sio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.querySelector('.fill').style.width = e.target.dataset.w + '%';
  animatePct(e.target);
  sio.unobserve(e.target);
}), { threshold: .5 });
$$('.skill').forEach(s => sio.observe(s));
function animatePct(skill) {
  const pct = skill.querySelector('.pct'), target = parseInt(pct.dataset.pct), t0 = performance.now();
  (function f(t) {
    const k = Math.min(1, (t - t0) / 1200);
    pct.textContent = Math.round(target * (0.3 + 0.7 * k)) + '%';
    if (k < 1) requestAnimationFrame(f);
  })(t0);
}

// --- terminal CLI ---
const termBody = $('#term-body'), termInput = $('#term-input');
const COMMANDS = {
  help:      () => `Available: ${Object.keys(COMMANDS).join(', ')}`,
  whoami:    () => 'Danny — Lead Full Stack Developer & Bot Architect | ZEUS TIER\'S | DANNY.TOP',
  skills:    () => 'React • Node.js • Python • Golang • Docker • MongoDB • Baileys • FastAPI',
  projects:  () => '1. Zeus Mario Game — https://zeus-mario-game.onrender.com/\n2. Zeus Sensi Premium — https://zeus-sensi.onrender.com/premium.html\n3. Media Boost — https://media-boost.onrender.com/\n4. Zeus IQ — https://zeus-iq.onrender.com/',
  contact:   () => 'Email: gd0560045@gmail.com | WhatsApp: https://wa.me/2348062285862',
  social:    () => 'TikTok: https://www.tiktok.com/@justdanny08\nTelegram: https://t.me/crushondanny\nWhatsApp Channel: https://whatsapp.com/channel/0029VabYlvq6xCSKAxKpKB1m',
  donate:    () => 'Opay: 8062285862 — Daniel Godwin Endurance\nWhatsApp: https://wa.me/2348062285862\nTelegram: https://t.me/crushondanny',
  date:      () => new Date().toString(),
  sudo:      () => 'danny@kernel has no password. You are already root. 😎',
  clear:     () => { termBody.innerHTML = ''; return null; }
};
function printLine(text, cls = '') {
  const p = document.createElement('p');
  p.className = 'term-line ' + cls;
  p.textContent = text; termBody.appendChild(p); termBody.scrollTop = termBody.scrollHeight;
}
function runCmd(raw) {
  const cmd = raw.trim().toLowerCase().split(/\s+/)[0];
  printLine(`danny@kernel:~$ ${raw}`, 'term-ok');
  const out = COMMANDS[cmd] ? COMMANDS[cmd]() : `command not found: ${cmd} — try 'help'`;
  if (out) printLine(out);
}
termInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && termInput.value.trim()) { runCmd(termInput.value); termInput.value = ''; }
});
$$('.quick').forEach(q => q.addEventListener('click', () => runCmd(q.dataset.cmd)));

// --- project filtering ---
$$('.filter-btn').forEach(btn => btn.addEventListener('click', () => {
  $$('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const f = btn.dataset.filter;
  $$('.project').forEach(proj => {
    const show = f === 'all' || proj.dataset.cat.includes(f);
    proj.classList.toggle('hide', !show);
  });
}));

// --- tech cloud drag rotate ---
const scene = $('#cloud-scene'), cloud = $('#tech-cloud');
let dragging = false, sx = 0, sy = 0, rx = 20, ry = 0;
cloud.addEventListener('pointerdown', e => { dragging = true; sx = e.clientX; sy = e.clientY; cloud.classList.add('dragging'); scene.style.animation = 'none'; });
addEventListener('pointermove', e => {
  if (!dragging) return;
  ry += (e.clientX - sx) * .4; rx = Math.max(-40, Math.min(60, rx - (e.clientY - sy) * .3));
  sx = e.clientX; sy = e.clientY;
  scene.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
});
addEventListener('pointerup', () => { dragging = false; cloud.classList.remove('dragging'); });

// --- copy Opay account number ---
$('#copy-pay').addEventListener('click', async () => {
  const addr = $('#pay-address').textContent.trim();
  try {
    await navigator.clipboard.writeText(addr);
    $('#copy-pay').textContent = '✓ Copied';
    setTimeout(() => $('#copy-pay').textContent = 'Copy', 1600);
  } catch { alert('Copy failed — select the number manually: ' + addr); }
});

// --- contact form (replace with your Formspree/Web3Forms ID) ---
$('#contact-form').addEventListener('submit', async e => {
  e.preventDefault();
  const status = $('#form-status');
  status.textContent = 'Sending…';
  const data = Object.fromEntries(new FormData(e.target));
  try {
    const res = await fetch('https://formspree.io/f/[YOUR_FORM_ID]', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error();
    status.textContent = '✓ Message sent — I\'ll get back to you soon!';
    e.target.reset();
  } catch { status.textContent = '✗ Failed to send. Email me directly at gd0560045@gmail.com'; }
});

// --- Byte bot ---
const botWin = $('#bot-window'), botBody = $('#bot-body'), botInput = $('#bot-input');
$('#bot-toggle').addEventListener('click', () => botWin.classList.toggle('open'));
$('#bot-close').addEventListener('click', () => botWin.classList.remove('open'));
const BOT_REPLIES = {
  services: '💼 Services: Web Systems, Mobile Apps, WhatsApp Bots, Backend & Cloud. Scroll to #services!',
  projects: '🚀 Projects: Zeus Mario Game, Zeus Sensi Premium, Media Boost, Zeus IQ. See #projects!',
  contact:  '📬 Email: gd0560045@gmail.com — or tap the WhatsApp button!',
  donate:   '☕ Thanks! Opay: 8062285862 — Daniel Godwin Endurance | Telegram: @crushondanny',
  hello:    'Beep boop! 👋 How can I help? Try: services, projects, contact, donate'
};
function botSay(text, out = true) {
  const p = document.createElement('p');
  p.className = 'bot-msg ' + (out ? 'bot-out' : 'bot-in');
  p.textContent = text; botBody.appendChild(p); botBody.scrollTop = botBody.scrollHeight;
}
botInput.addEventListener('keydown', e => {
  if (e.key !== 'Enter' || !botInput.value.trim()) return;
  const q = botInput.value.trim().toLowerCase(); botSay(q); botInput.value = '';
  const key = Object.keys(BOT_REPLIES).find(k => q.includes(k));
  setTimeout(() => botSay(key ? BOT_REPLIES[key] : BOT_REPLIES.hello, false), 450);
});
