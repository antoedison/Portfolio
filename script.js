
// ---------------------------
// Data (Edit me!)
// ---------------------------
const PROJECTS = [
  {
    title: "Design System — Atlas UI",
    image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?q=80&w=1600&auto=format&fit=crop",
    tags: ["frontend", "design"],
    excerpt: "Headless components, tokens, theming, docs site.",
    description: "Built a scalable design system with CSS variables, tokens, dark mode, and headless components. Automated visual testing and published as an internal npm package.",
    links: [
      { label: "Case Study", href: "#" },
      { label: "Storybook", href: "#" }
    ]
  },
  {
    title: "Realtime Analytics Dashboard",
    image: "https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=1600&auto=format&fit=crop",
    tags: ["fullstack", "frontend"],
    excerpt: "WebSockets, charts, offline support.",
    description: "Implemented live charts, optimistic UI, and offline caching. Achieved Lighthouse 98 and sub‑second TTI.",
    links: [
      { label: "Live Demo", href: "#" },
      { label: "GitHub", href: "#" }
    ]
  },
  {
    title: "Interactive Marketing Site",
    image: "https://images.unsplash.com/photo-1520975922284-4a9f74a7f1c4?q=80&w=1600&auto=format&fit=crop",
    tags: ["frontend", "design"],
    excerpt: "3D hero, micro‑interactions.",
    description: "A playful landing page with WebGL‑like motion, scroll‑linked animations, and strong a11y under the hood.",
    links: [
      { label: "Visit Site", href: "#" }
    ]
  },
  {
    title: "Open Source: Tiny‑State",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop",
    tags: ["frontend"],
    excerpt: "100 LOC state manager.",
    description: "A tiny state container with hooks‑like API. Focus on learning and DX.",
    links: [
      { label: "GitHub", href: "#" },
      { label: "Docs", href: "#" }
    ]
  }
];

// ---------------------------
// Utilities
// ---------------------------
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

// Smooth scrolling and active nav state
$$('nav a').forEach(a=>{
  a.addEventListener('click', e=>{
    if(a.hash){
      e.preventDefault();
      document.querySelector(a.hash)?.scrollIntoView({behavior:'smooth', block:'start'});
    }
  })
});
const sections = $$('main section[id]');
const io = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    const id = entry.target.id;
    const link = $$('nav a').find(a=>a.hash === '#'+id);
    if(entry.isIntersecting){
      $$('nav a').forEach(a=>a.classList.remove('active'));
      link?.classList.add('active');
      entry.target.classList.add('in');
    }
  })
}, { threshold:.12 });
sections.forEach(s=>{ s.classList.add('fade-up'); io.observe(s) });

// Theme toggle with persistence
const root = document.documentElement;
const themeToggle = $('#themeToggle');
const storedTheme = localStorage.getItem('theme');
if(storedTheme){ root.setAttribute('data-theme', storedTheme) }
themeToggle.addEventListener('click', ()=>{
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// Render projects
const grid = $('#projectGrid');
const renderProjects = (filter='all')=>{
  grid.innerHTML = '';
  const list = PROJECTS.filter(p=> filter==='all' ? true : p.tags.includes(filter));
  if(list.length===0){
    grid.innerHTML = '<p class="hint">No projects in this category yet. Check back soon.</p>';
    return;
  }
  list.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'project card';
    card.style.setProperty('--bg-img', `url('${p.image}')`);
    card.innerHTML = `
      <div class="overlay"></div>
      <div class="tags">${p.tags.map(t=>`<span>${t}</span>`).join('')}</div>
      <h3>${p.title}</h3>
      <p>${p.excerpt}</p>
      <div class="cta">
        <button type="button" class="open" aria-label="Open details for ${p.title}">Details</button>
        ${p.links.map(l=>`<a class="open-link" target="_blank" rel="noopener" href="${l.href}">${l.label}</a>`).join('')}
      </div>
    `;
    card.querySelector('button.open').addEventListener('click', ()=> openModal(p));
    grid.appendChild(card);
  });
};
renderProjects();

// Filters
$$('.filters .chip').forEach(chip=>{
  chip.addEventListener('click', ()=>{
    $$('.filters .chip').forEach(c=>c.classList.remove('active'));
    chip.classList.add('active');
    const filter = chip.dataset.filter;
    renderProjects(filter);
  });
});

// Modal
const modal = $('#projectModal');
const modalTitle = $('#modalTitle');
const modalDesc = $('#modalDesc');
const modalLinks = $('#modalLinks');
const modalMedia = $('#modalMedia');
const openModal = (proj)=>{
  modalTitle.textContent = proj.title;
  modalDesc.textContent = proj.description;
  modalLinks.innerHTML = proj.links.map(l=>`<a class="btn secondary" target="_blank" rel="noopener" href="${l.href}">${l.label}</a>`).join('');
  modalMedia.innerHTML = `<img alt="${proj.title}" src="${proj.image}" style="width:100%;height:100%;object-fit:cover" />`;
  modal.showModal();
};
$('#closeModal').addEventListener('click', ()=> modal.close());
modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.close() });

// Contact form validation (client-only)
const form = $('#contactForm');
const emailRE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const setError = (name, msg='')=>{
  const el = $(`[data-error-for="${name}"]`);
  el.textContent = msg;
};
form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  let ok = true;
  if(!data.name || data.name.trim().length < 2){ setError('name','Please enter your name.'); ok=false } else setError('name');
  if(!emailRE.test(data.email || '')){ setError('email','Enter a valid email.'); ok=false } else setError('email');
  if(!data.message || data.message.trim().length < 10){ setError('message','Tell me a bit more (min 10 chars).'); ok=false } else setError('message');

  if(ok){
    // Option A: open mailto with prefilled body
    const subject = encodeURIComponent('Portfolio enquiry from ' + data.name);
    const body = encodeURIComponent(`${data.message}\n\n— ${data.name}\n${data.email}`);
    window.location.href = `mailto:edisonanto7@email.com?subject=${subject}&body=${body}`;
    form.reset();
    $('#formHint').textContent = 'Thanks! Your email app should be opening…';
  }
});

// Copy email helper
$('#copyEmail').addEventListener('click', async ()=>{
  try{
    await navigator.clipboard.writeText('edisonanto7@email.com');
    const b = $('#copyEmail'); const old = b.textContent;
    b.textContent = 'Copied!';
    setTimeout(()=> b.textContent = old, 1600);
  }catch{ alert('Copy failed — please copy manually: your@email.com') }
});

// Footer year
$('#year').textContent = new Date().getFullYear();

// Keyboard: Escape closes modal
window.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && modal.open) modal.close() });
