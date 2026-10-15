/* ============================================================
   NAV: mobile toggle + active link on scroll
============================================================ */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', ()=> navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>navLinks.classList.remove('open')));

/* Active nav link is set per page in the HTML (aria-current="page"). */

/* ============================================================
   HERO ROLE TYPING LOOP
============================================================ */
const roles = [
  "Web Developer & Startup Enthusiast",
  "Founder, SpareFixer",
  "Python Full-Stack Learner"
];
const typedEl = document.getElementById('typedText');
let rIdx = 0, cIdx = 0, deleting = false;
function typeRole(){
  const full = roles[rIdx];
  if(!deleting){
    cIdx++;
    typedEl.textContent = full.slice(0, cIdx);
    if(cIdx === full.length){ deleting = true; setTimeout(typeRole, 1500); return; }
  } else {
    cIdx--;
    typedEl.textContent = full.slice(0, cIdx);
    if(cIdx === 0){ deleting = false; rIdx = (rIdx+1) % roles.length; }
  }
  setTimeout(typeRole, deleting ? 32 : 52);
}
if(typedEl) typeRole();

/* ============================================================
   TERMINAL TYPING (single orchestrated hero moment)
============================================================ */
const termHTML =
`<span class="term-cm"># sparefixer_intro.py</span>
<span class="term-kw">class</span> <span class="term-fn">SpareFixer</span>:
    <span class="term-kw">def</span> <span class="term-fn">__init__</span>(self):
        self.founder = <span class="term-str">"Manohar Sharma"</span>
        self.mission = <span class="term-str">"find the right auto part, fast"</span>

    <span class="term-kw">def</span> <span class="term-fn">find_part</span>(self, vehicle, part):
        <span class="term-kw">return</span> match(vehicle, part)

<span class="term-cm"># status: pitch in progress</span>`;

const termEl = document.getElementById('term-typed');
let termShown = false;
function typeTerminal(){
  if(termShown || !termEl) return;
  termShown = true;
  const plain = termHTML;
  let i = 0;
  // reveal by chunks for performance, tag-aware via incremental innerHTML
  const chars = plain.split('');
  function step(){
    if(i > chars.length){ return; }
    termEl.innerHTML = plain.slice(0, i);
    i += 3;
    if(i <= chars.length){ requestAnimationFrame(()=>setTimeout(step, 6)); }
    else { termEl.innerHTML = plain; }
  }
  step();
}

/* ============================================================
   SCROLL REVEAL (IntersectionObserver)
============================================================ */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, {threshold:0.15});
revealEls.forEach(el=>io.observe(el));

/* kick off terminal typing once hero is visible */
setTimeout(typeTerminal, 500);

/* ============================================================
   COUNTERS
============================================================ */
const counters = document.querySelectorAll('.num');
const counterIO = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'), 10);
      const duration = 1200;
      const start = performance.now();
      function step(ts){
        const p = Math.min((ts - start)/duration, 1);
        const eased = 1 - Math.pow(1-p, 3);
        el.textContent = Math.round(eased * target);
        if(p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      counterIO.unobserve(el);
    }
  });
}, {threshold:0.5});
counters.forEach(c=>counterIO.observe(c));

/* ============================================================
   SKILL BARS
============================================================ */
const bars = document.querySelectorAll('.bar-fill');
const barIO = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const el = entry.target;
      el.style.width = el.getAttribute('data-value') + '%';
      barIO.unobserve(el);
    }
  });
}, {threshold:0.4});
bars.forEach(b=>barIO.observe(b));

/* ============================================================
   PROJECT CARDS: link config + cursor spotlight
   Add the SpareFixer URL below when it goes live (e.g. "https://sparefixer.vercel.app/").
   Leave it empty and the button stays disabled with a "coming soon" note.
============================================================ */
const PROJECT_LINKS = {
  sparefixer: ""
};
document.querySelectorAll('.project-btn[data-project]').forEach(a=>{
  const url = (PROJECT_LINKS[a.dataset.project] || '').trim();
  const note = document.getElementById(a.dataset.project + 'Note');
  if(url){
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.removeAttribute('aria-disabled');
    a.setAttribute('aria-label', 'Explore ' + a.closest('.project-card').querySelector('h3').textContent + ' project (opens in a new tab)');
    if(note) note.hidden = true;
  } else {
    a.setAttribute('aria-disabled', 'true');
    a.setAttribute('aria-label', 'SpareFixer project link coming soon');
    a.addEventListener('click', e=> e.preventDefault());
  }
});
document.querySelectorAll('.project-card').forEach(card=>{
  card.addEventListener('pointermove', e=>{
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
});

/* ============================================================
   CONTACT FORM (demo submit)
============================================================ */
const contactForm = document.getElementById('contactForm');
if(contactForm) contactForm.addEventListener('submit', function(e){
  e.preventDefault();
  document.getElementById('formMsg').textContent = 'Thanks — message noted. This is a demo form; connect it to a backend or form service to send real email.';
  this.reset();
});

/* ============================================================
   BACK TO TOP
============================================================ */
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', ()=>{
  toTop.classList.toggle('show', window.scrollY > 600);
});
toTop.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

/* ============================================================
   BACKGROUND CANVAS — drifting circuit-trace lines
============================================================ */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, nodes = [];
function resize(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = document.documentElement.scrollHeight;
}
function initNodes(){
  nodes = [];
  const count = Math.min(46, Math.floor(window.innerWidth/32));
  for(let i=0;i<count;i++){
    nodes.push({
      x: Math.random()*W,
      y: Math.random()*H,
      vy: -(Math.random()*0.22 + 0.04),
      vx: (Math.random()-0.5)*0.12,
      r: Math.random()*1.6 + 0.6,
      hue: Math.random() > 0.5 ? 'amber' : 'cyan'
    });
  }
}
function drawNodes(){
  ctx.clearRect(0,0,W,H);
  for(let i=0;i<nodes.length;i++){
    const p = nodes[i];
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fillStyle = p.hue === 'amber' ? 'rgba(255,122,51,0.35)' : 'rgba(43,217,201,0.30)';
    ctx.fill();
    p.y += p.vy;
    p.x += p.vx;
    if(p.y < -10){ p.y = H+10; p.x = Math.random()*W; }
    for(let j=i+1;j<nodes.length;j++){
      const q = nodes[j];
      const dx = p.x-q.x, dy = p.y-q.y;
      const dist = Math.sqrt(dx*dx+dy*dy);
      if(dist < 130){
        ctx.beginPath();
        ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y);
        ctx.strokeStyle = `rgba(140,150,170,${0.06 * (1 - dist/130)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawNodes);
}
resize();
initNodes();
drawNodes();
window.addEventListener('resize', ()=>{ resize(); initNodes(); });
