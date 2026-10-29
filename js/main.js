document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle (Dark / Light)
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.querySelector('.theme-icon');
  let dark = Boolean(document.body.dataset.portalRole);
  try {
    const savedTheme = localStorage.getItem('drivepro-theme');
    if (savedTheme) dark = savedTheme === 'dark';
  } catch {}
  
  function applyTheme(on) {
    document.body.classList.toggle('dark-mode', on);
    themeToggle?.setAttribute('aria-pressed', String(on));
    themeToggle?.setAttribute('aria-label', on ? 'Switch to light theme' : 'Switch to dark theme');
    if (themeIcon) themeIcon.textContent = on ? '☾' : '☼';
  }
  applyTheme(dark);
  themeToggle?.addEventListener('click', () => {
    dark = !document.body.classList.contains('dark-mode');
    applyTheme(dark);
    try { localStorage.setItem('drivepro-theme', dark ? 'dark' : 'light'); } catch {}
  });

  // Direction Toggle (LTR / RTL)
  const directionToggle = document.getElementById('directionToggle');
  let rtl = false;
  try { rtl = localStorage.getItem('drivepro-direction') === 'rtl'; } catch {}
  function applyDirection(on) {
    document.documentElement.dir = on ? 'rtl' : 'ltr';
    directionToggle?.setAttribute('aria-pressed', String(on));
    directionToggle?.setAttribute('aria-label', on ? 'Switch to left-to-right direction' : 'Switch to right-to-left direction');
    if (directionToggle) directionToggle.textContent = on ? 'RTL' : 'LTR';
  }
  applyDirection(rtl);
  directionToggle?.addEventListener('click', () => {
    rtl = document.documentElement.dir !== 'rtl';
    applyDirection(rtl);
    try { localStorage.setItem('drivepro-direction', rtl ? 'rtl' : 'ltr'); } catch {}
  });

  // Navigation Menu Toggle (Mobile Drawer)
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNavigation');
  if (menuToggle && nav) {
    const dropdowns = [...nav.querySelectorAll('.nav-dropdown')];
    const closeDropdowns = () => dropdowns.forEach(item => { item.open = false; });
    
    dropdowns.forEach(item => item.addEventListener('toggle', () => {
      if (item.open && matchMedia('(max-width: 1180px)').matches) {
        dropdowns.forEach(other => { if (other !== item) other.open = false; });
      }
    }));
    
    menuToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      if (!open) closeDropdowns();
    });
    
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      closeDropdowns();
    }));
    
    document.addEventListener('click', e => {
      if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
        nav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        closeDropdowns();
      }
    });
    
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closeDropdowns();
        nav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Portal Sidebar Toggle
  const portalMenuToggle = document.getElementById('portalMenuToggle');
  const portalSidebar = document.getElementById('portalSidebar');
  if (portalMenuToggle && portalSidebar) {
    const closePortalMenu = () => {
      portalSidebar.classList.remove('is-open');
      portalMenuToggle.setAttribute('aria-expanded', 'false');
    };
    portalMenuToggle.addEventListener('click', () => {
      const open = portalSidebar.classList.toggle('is-open');
      portalMenuToggle.setAttribute('aria-expanded', String(open));
    });
    portalSidebar.querySelectorAll('.portal-nav a, .portal-logout').forEach(link => link.addEventListener('click', closePortalMenu));
    document.addEventListener('click', e => {
      if (!portalSidebar.contains(e.target) && !portalMenuToggle.contains(e.target)) closePortalMenu();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closePortalMenu();
    });
  }
  
  document.querySelectorAll('.portal-logout').forEach(link => link.addEventListener('click', () => {
    try { sessionStorage.removeItem('drivepro-current-user'); } catch {}
  }));

  // Accordion FAQs
  document.querySelectorAll('.faq-question').forEach(btn => btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const open = item.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  }));

  // Password Reveal Toggle
  const eyeIcon = struck => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>${struck ? '<path d="m3 3 18 18"/>' : ''}</svg>`;
  document.querySelectorAll('[data-password-toggle]').forEach(btn => {
    btn.innerHTML = eyeIcon(true);
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.passwordToggle);
      if (!input) return;
      const reveal = input.type === 'password';
      input.type = reveal ? 'text' : 'password';
      btn.innerHTML = eyeIcon(!reveal);
      btn.setAttribute('aria-pressed', String(reveal));
      btn.setAttribute('aria-label', reveal ? 'Hide password' : 'Show password');
    });
  });

  // Course Filter & Search
  const courseSearch = document.querySelector('[data-course-search]');
  const courseCards = [...document.querySelectorAll('[data-course-card]')];
  const courseFilters = [...document.querySelectorAll('[data-course-filter]')];
  let activeCourseFilter = 'all';

  function filterCourses() {
    const query = (courseSearch?.value || '').trim().toLowerCase();
    courseCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const cat = card.dataset.category || '';
      const matchesText = !query || text.includes(query);
      const matchesFilter = activeCourseFilter === 'all' || cat === activeCourseFilter;
      card.classList.toggle('hidden', !(matchesText && matchesFilter));
    });
  }

  courseSearch?.addEventListener('input', filterCourses);
  courseFilters.forEach(btn => btn.addEventListener('click', () => {
    activeCourseFilter = btn.dataset.courseFilter;
    courseFilters.forEach(b => b.classList.toggle('active', b === btn));
    filterCourses();
  }));

  // Auto-activate course filter from URL hash/param
  try {
    const params = new URLSearchParams(window.location.search);
    const filterParam = params.get('filter');
    if (filterParam) {
      const matchBtn = courseFilters.find(b => b.dataset.courseFilter === filterParam);
      if (matchBtn) matchBtn.click();
    }
  } catch {}

  // Instructor Filter & Search
  const instructorSearch = document.querySelector('[data-instructor-search]');
  const instructorCards = [...document.querySelectorAll('[data-instructor-card]')];
  const instructorFilters = [...document.querySelectorAll('[data-instructor-filter]')];
  let activeInstFilter = 'all';

  function filterInstructors() {
    const query = (instructorSearch?.value || '').trim().toLowerCase();
    instructorCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const specialty = card.dataset.specialty || '';
      const matchesText = !query || text.includes(query);
      const matchesFilter = activeInstFilter === 'all' || specialty.includes(activeInstFilter);
      card.classList.toggle('hidden', !(matchesText && matchesFilter));
    });
  }

  instructorSearch?.addEventListener('input', filterInstructors);
  instructorFilters.forEach(btn => btn.addEventListener('click', () => {
    activeInstFilter = btn.dataset.instructorFilter;
    instructorFilters.forEach(b => b.classList.toggle('active', b === btn));
    filterInstructors();
  }));

  // Pre-fill booking form based on URL params (e.g. contact.html?instructor=Sarah or ?course=ClassD)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const instParam = urlParams.get('instructor');
    const courseParam = urlParams.get('course');
    if (instParam) {
      const instSelect = document.getElementById('booking-instructor');
      if (instSelect) {
        for (let i = 0; i < instSelect.options.length; i++) {
          if (instSelect.options[i].text.toLowerCase().includes(instParam.toLowerCase())) {
            instSelect.selectedIndex = i;
            break;
          }
        }
      }
    }
    if (courseParam) {
      const courseSelect = document.getElementById('booking-course');
      if (courseSelect) {
        for (let i = 0; i < courseSelect.options.length; i++) {
          if (courseSelect.options[i].value.toLowerCase().includes(courseParam.toLowerCase()) || 
              courseSelect.options[i].text.toLowerCase().includes(courseParam.toLowerCase())) {
            courseSelect.selectedIndex = i;
            break;
          }
        }
      }
    }
  } catch {}

  // Interactive Booking Form Handler
  const bookingForm = document.querySelector('[data-booking-form]');
  if (bookingForm) {
    bookingForm.addEventListener('submit', event => {
      event.preventDefault();
      if (!bookingForm.reportValidity()) return;
      const formData = new FormData(bookingForm);
      const name = formData.get('name') || 'Learner';
      const phone = formData.get('phone') || '';
      const course = formData.get('course') || 'Driving Program';
      const instructor = formData.get('instructor') || 'Next Available Certified Instructor';
      const schedule = formData.get('schedule') || 'Flexible Time';

      const statusBox = document.getElementById('bookingStatus');
      if (statusBox) {
        statusBox.innerHTML = `
          <div class="booking-confirmation-card">
            <h4>✓ Driving Lesson Request Received!</h4>
            <p>Thank you, <strong>${name}</strong>. Your lesson request for <strong>${course}</strong> has been prioritised.</p>
            <p><strong>Assigned Preference:</strong> ${instructor} · <strong>Preferred Time:</strong> ${schedule}</p>
            <p>Our senior admissions officer will call you at <strong>${phone}</strong> within 2 hours to confirm your instructor match, vehicle assignment, and lesson door-to-door pickup.</p>
          </div>
        `;
        statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      bookingForm.reset();
    });
  }

  // Standard Contact Form Handler
  const contactForm = document.querySelector('[data-contact-form]');
  if (contactForm && !bookingForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!contactForm.reportValidity()) return;
      const status = contactForm.querySelector('[data-form-status]');
      if (status) {
        status.innerHTML = `<span style="color:#2b5639;font-weight:700;">✓ Thank you! Your inquiry has been submitted. A DrivePro advisor will contact you within 24 hours.</span>`;
      }
      contactForm.reset();
    });
  }

  // Auth Forms Handler
  document.querySelectorAll('[data-auth-form]').forEach(form => form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form).entries());
    const status = form.querySelector('[data-auth-status]');
    const email = String(values.email || '').trim().toLowerCase();
    try {
      const accounts = JSON.parse(localStorage.getItem('drivepro-accounts') || '{}') || {};
      if (form.dataset.authForm === 'register') {
        if (accounts[email]) {
          if (status) status.textContent = 'An account with this email already exists. Sign in instead.';
          return;
        }
        accounts[email] = { name: values.name, phone: values.phone, course: values.course };
        localStorage.setItem('drivepro-accounts', JSON.stringify(accounts));
      } else if (!accounts[email]) {
        if (status) status.textContent = 'We could not find an account with that email. Create an account to continue.';
        return;
      }
      sessionStorage.setItem('drivepro-current-user', JSON.stringify({ email, name: accounts[email]?.name || email.split('@')[0], role: 'student' }));
      location.href = 'student-dashboard.html';
    } catch {
      if (status) status.textContent = 'Your browser could not save this account. Check browser storage settings and try again.';
    }
  }));

  document.querySelectorAll('[data-disabled-action]').forEach(el => {
    el.addEventListener('click', e => e.preventDefault());
  });
});
