document.addEventListener('DOMContentLoaded',()=>{
  const themeToggle=document.getElementById('themeToggle');const themeIcon=document.querySelector('.theme-icon');let dark=Boolean(document.body.dataset.portalRole);try{const savedTheme=localStorage.getItem('drivepro-theme');if(savedTheme)dark=savedTheme==='dark';}catch{}function applyTheme(on){document.body.classList.toggle('dark-mode',on);themeToggle?.setAttribute('aria-pressed',String(on));themeToggle?.setAttribute('aria-label',on?'Switch to light theme':'Switch to dark theme');if(themeIcon)themeIcon.textContent=on?'☾':'☼';}applyTheme(dark);themeToggle?.addEventListener('click',()=>{dark=!document.body.classList.contains('dark-mode');applyTheme(dark);try{localStorage.setItem('drivepro-theme',dark?'dark':'light');}catch{}});
  const directionToggle=document.getElementById('directionToggle');let rtl=false;try{rtl=localStorage.getItem('drivepro-direction')==='rtl';}catch{}function applyDirection(on){document.documentElement.dir=on?'rtl':'ltr';directionToggle?.setAttribute('aria-pressed',String(on));directionToggle?.setAttribute('aria-label',on?'Switch to left-to-right direction':'Switch to right-to-left direction');if(directionToggle)directionToggle.textContent=on?'RTL':'LTR';}applyDirection(rtl);directionToggle?.addEventListener('click',()=>{rtl=document.documentElement.dir!=='rtl';applyDirection(rtl);try{localStorage.setItem('drivepro-direction',rtl?'rtl':'ltr');}catch{}});
  const menuToggle=document.getElementById('menuToggle');
  const nav=document.getElementById('mainNavigation');
  if(menuToggle&&nav){
    const dropdowns=[...nav.querySelectorAll('.nav-dropdown')];
    const closeDropdowns=()=>dropdowns.forEach(item=>{item.open=false;});
    // Native <details>/<summary> handles desktop click, keyboard, and mobile tap.
    // Desktop hover and focus visibility are handled by navigation.css.
    dropdowns.forEach(item=>item.addEventListener('toggle',()=>{
      if(item.open&&matchMedia('(max-width: 1180px)').matches){
        dropdowns.forEach(other=>{if(other!==item)other.open=false;});
      }
    }));
    menuToggle.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Close navigation menu':'Open navigation menu');if(!open)closeDropdowns();});
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('is-open');menuToggle.setAttribute('aria-expanded','false');closeDropdowns();}));
    document.addEventListener('click',e=>{if(!nav.contains(e.target)&&!menuToggle.contains(e.target)){nav.classList.remove('is-open');menuToggle.setAttribute('aria-expanded','false');closeDropdowns();}});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeDropdowns();nav.classList.remove('is-open');menuToggle.setAttribute('aria-expanded','false');}});
  }
  const portalMenuToggle=document.getElementById('portalMenuToggle');
  const portalSidebar=document.getElementById('portalSidebar');
  if(portalMenuToggle&&portalSidebar){
    const closePortalMenu=()=>{portalSidebar.classList.remove('is-open');portalMenuToggle.setAttribute('aria-expanded','false');};
    portalMenuToggle.addEventListener('click',()=>{const open=portalSidebar.classList.toggle('is-open');portalMenuToggle.setAttribute('aria-expanded',String(open));});
    portalSidebar.querySelectorAll('.portal-nav a,.portal-logout').forEach(link=>link.addEventListener('click',closePortalMenu));
    document.addEventListener('click',e=>{if(!portalSidebar.contains(e.target)&&!portalMenuToggle.contains(e.target))closePortalMenu();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closePortalMenu();});
  }
  // Local-first Pexels images. If the image pack has not yet been downloaded, use the Pexels CDN source.
  document.querySelectorAll('img[data-fallback]').forEach(img=>{img.addEventListener('error',()=>{if(img.dataset.fallback&&img.src!==img.dataset.fallback){img.src=img.dataset.fallback;}},{once:true});});
  document.querySelectorAll('.faq-question').forEach(btn=>btn.addEventListener('click',()=>{const item=btn.closest('.faq-item');const open=item.classList.toggle('open');btn.setAttribute('aria-expanded',String(open));}));
  const eyeIcon=struck=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>${struck?'<path d="m3 3 18 18"/>':''}</svg>`;
  document.querySelectorAll('[data-password-toggle]').forEach(btn=>{btn.innerHTML=eyeIcon(true);btn.addEventListener('click',()=>{const input=document.getElementById(btn.dataset.passwordToggle);if(!input)return;const reveal=input.type==='password';input.type=reveal?'text':'password';btn.innerHTML=eyeIcon(!reveal);btn.setAttribute('aria-pressed',String(reveal));btn.setAttribute('aria-label',reveal?'Hide password':'Show password');});});
  // Search/filter only operate on real page content. No invented records are generated.
  const courseSearch=document.querySelector('[data-course-search]');
  const courseCards=[...document.querySelectorAll('[data-course-card]')];
  const filters=[...document.querySelectorAll('[data-course-filter]')];let activeFilter='all';
  function filterCourses(){const query=(courseSearch?.value||'').trim().toLowerCase();courseCards.forEach(card=>{const matchesText=card.textContent.toLowerCase().includes(query);const matchesFilter=activeFilter==='all'||card.dataset.category===activeFilter;card.classList.toggle('hidden',!(matchesText&&matchesFilter));});}
  courseSearch?.addEventListener('input',filterCourses);filters.forEach(btn=>btn.addEventListener('click',()=>{activeFilter=btn.dataset.courseFilter;filters.forEach(b=>b.classList.toggle('active',b===btn));filterCourses();}));
  const instructorSearch=document.querySelector('[data-instructor-search]');
  instructorSearch?.addEventListener('input',()=>{document.querySelectorAll('[data-instructor-card]').forEach(card=>card.classList.toggle('hidden',!card.textContent.toLowerCase().includes(instructorSearch.value.toLowerCase().trim())));});
  // Keep presentation-only forms local; no authentication service is connected.
  document.querySelectorAll('[data-visual-form]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();}));
  const contactForm=document.querySelector('[data-contact-form]');
  if(contactForm){contactForm.addEventListener('submit',e=>{e.preventDefault();if(!contactForm.reportValidity())return;const status=contactForm.querySelector('[data-form-status]');if(status)status.textContent='Your entries passed local validation, but no message was sent because a delivery service is not connected.';});}
  document.querySelectorAll('[data-disabled-action]').forEach(el=>{el.addEventListener('click',e=>e.preventDefault());});
});
