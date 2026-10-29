document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollBehavior = reducedMotion ? 'auto' : 'smooth';

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

    // Handle mouse hover with smooth debounce on desktop
    dropdowns.forEach(item => {
      let timeout;
      item.addEventListener('mouseenter', () => {
        if (window.innerWidth > 1180) {
          clearTimeout(timeout);
          dropdowns.forEach(other => {
            if (other !== item) {
              other.open = false;
            }
          });
          item.open = true;
        }
      });

      item.addEventListener('mouseleave', () => {
        if (window.innerWidth > 1180) {
          timeout = setTimeout(() => {
            item.open = false;
          }, 160);
        }
      });

      item.addEventListener('toggle', () => {
        const isOpen = item.open;
        if (isOpen) {
          dropdowns.forEach(other => {
            if (other !== item) {
              other.open = false;
            }
          });
        }
      });
    });

    menuToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      document.body.classList.toggle('no-scroll', open);
      if (!open) closeDropdowns();
    });

    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation menu');
      document.body.classList.remove('no-scroll');
      closeDropdowns();
    }));

    document.addEventListener('click', e => {
      if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
        nav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation menu');
        document.body.classList.remove('no-scroll');
        closeDropdowns();
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        const activeDropdown = dropdowns.find(d => d.open);
        if (activeDropdown && window.innerWidth > 1180) {
          const summary = activeDropdown.querySelector('summary');
          activeDropdown.open = false;
          summary?.focus();
          return;
        }
        if (!activeDropdown && !nav.classList.contains('is-open')) return;
        nav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation menu');
        document.body.classList.remove('no-scroll');
        menuToggle.focus();
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
      if (e.key === 'Escape' && portalSidebar.classList.contains('is-open')) {
        closePortalMenu();
        portalMenuToggle.focus();
      }
    });
  }
  
  document.querySelectorAll('.portal-logout').forEach(link => link.addEventListener('click', () => {
    try { sessionStorage.removeItem('drivepro-current-user'); } catch {}
  }));

  // Accordion FAQs
  document.querySelectorAll('.faq-question').forEach((btn, index) => {
    const answer = btn.closest('.faq-item')?.querySelector('.faq-answer');
    if (answer) {
      if (!answer.id) answer.id = `faq-answer-${index + 1}`;
      btn.setAttribute('aria-controls', answer.id);
    }
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });

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
  const courseEmptyState = document.getElementById('courseEmptyState');
  const courseEmptyMsg = document.getElementById('courseEmptyMessage');
  const resetCourseBtn = document.getElementById('resetCourseFilterBtn');
  let activeCourseFilter = 'all';
  courseFilters.forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.courseFilter === activeCourseFilter)));

  function filterCourses() {
    const query = (courseSearch?.value || '').trim().toLowerCase();
    let visibleCount = 0;
    courseCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const cat = card.dataset.category || '';
      const matchesText = !query || text.includes(query);
      const matchesFilter = activeCourseFilter === 'all' || cat === activeCourseFilter;
      const isVisible = matchesText && matchesFilter;
      card.classList.toggle('hidden', !isVisible);
      if (isVisible) visibleCount++;
    });

    if (courseEmptyState) {
      if (visibleCount === 0) {
        courseEmptyState.classList.remove('hidden');
        if (courseEmptyMsg) {
          if (query) {
            courseEmptyMsg.textContent = `We couldn't find any driving programs matching "${courseSearch.value.trim()}". Try checking your spelling or view all training programs.`;
          } else {
            courseEmptyMsg.textContent = `No driving programs are currently listed under this category filter. Try selecting another category or view all courses.`;
          }
        }
      } else {
        courseEmptyState.classList.add('hidden');
      }
    }
  }

  courseSearch?.addEventListener('input', filterCourses);
  courseFilters.forEach(btn => btn.addEventListener('click', () => {
    activeCourseFilter = btn.dataset.courseFilter;
    courseFilters.forEach(b => {
      const selected = b === btn;
      b.classList.toggle('active', selected);
      b.setAttribute('aria-pressed', String(selected));
    });
    filterCourses();
  }));

  resetCourseBtn?.addEventListener('click', () => {
    if (courseSearch) courseSearch.value = '';
    activeCourseFilter = 'all';
    courseFilters.forEach(b => {
      const selected = b.dataset.courseFilter === 'all';
      b.classList.toggle('active', selected);
      b.setAttribute('aria-pressed', String(selected));
    });
    filterCourses();
    courseSearch?.focus();
  });

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
  const instructorEmptyState = document.getElementById('instructorEmptyState');
  const instructorEmptyMsg = document.getElementById('instructorEmptyMessage');
  const resetInstructorBtn = document.getElementById('resetInstructorFilterBtn');
  let activeInstFilter = 'all';
  instructorFilters.forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.instructorFilter === activeInstFilter)));

  function filterInstructors() {
    const query = (instructorSearch?.value || '').trim().toLowerCase();
    let visibleCount = 0;
    instructorCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const specialty = card.dataset.specialty || '';
      const matchesText = !query || text.includes(query);
      const matchesFilter = activeInstFilter === 'all' || specialty.includes(activeInstFilter);
      const isVisible = matchesText && matchesFilter;
      card.classList.toggle('hidden', !isVisible);
      if (isVisible) visibleCount++;
    });

    if (instructorEmptyState) {
      if (visibleCount === 0) {
        instructorEmptyState.classList.remove('hidden');
        if (instructorEmptyMsg) {
          if (query) {
            instructorEmptyMsg.textContent = `We couldn't find any instructor profiles matching "${instructorSearch.value.trim()}". Try a different search term.`;
          } else {
            instructorEmptyMsg.textContent = `No instructors match this specialization filter. Try switching categories or view all instructors.`;
          }
        }
      } else {
        instructorEmptyState.classList.add('hidden');
      }
    }
  }

  instructorSearch?.addEventListener('input', filterInstructors);
  instructorFilters.forEach(btn => btn.addEventListener('click', () => {
    activeInstFilter = btn.dataset.instructorFilter;
    instructorFilters.forEach(b => {
      const selected = b === btn;
      b.classList.toggle('active', selected);
      b.setAttribute('aria-pressed', String(selected));
    });
    filterInstructors();
  }));

  resetInstructorBtn?.addEventListener('click', () => {
    if (instructorSearch) instructorSearch.value = '';
    activeInstFilter = 'all';
    instructorFilters.forEach(b => {
      const selected = b.dataset.instructorFilter === 'all';
      b.classList.toggle('active', selected);
      b.setAttribute('aria-pressed', String(selected));
    });
    filterInstructors();
    instructorSearch?.focus();
  });

  // Set booking date minimum to tomorrow
  const dateInput = document.getElementById('booking-date');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
  }

  // Pre-fill booking form based on URL params (e.g. contact.html?instructor=Sarah or ?course=ClassD)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const instParam = urlParams.get('instructor');
    const courseParam = urlParams.get('course');
    const transSelect = document.getElementById('booking-trans');

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
        const cleanParam = courseParam.toLowerCase().replace(/[-_]/g, ' ');
        let matched = false;

        for (let i = 0; i < courseSelect.options.length; i++) {
          const optText = courseSelect.options[i].text.toLowerCase();
          const optVal = courseSelect.options[i].value.toLowerCase();
          if (optText.includes(cleanParam) || optVal.includes(cleanParam)) {
            courseSelect.selectedIndex = i;
            matched = true;
            break;
          }
        }

        if (!matched) {
          const keywords = cleanParam.split(' ').filter(w => w.length > 2);
          for (let i = 0; i < courseSelect.options.length; i++) {
            const optText = courseSelect.options[i].text.toLowerCase();
            if (keywords.some(k => optText.includes(k))) {
              courseSelect.selectedIndex = i;
              matched = true;
              break;
            }
          }
        }

        // Auto-sync transmission based on course
        if (transSelect) {
          if (cleanParam.includes('motorcycle') || cleanParam.includes('bike') || cleanParam.includes('cbt')) {
            for (let j = 0; j < transSelect.options.length; j++) {
              if (transSelect.options[j].text.toLowerCase().includes('motorcycle')) {
                transSelect.selectedIndex = j;
                break;
              }
            }
          } else if (cleanParam.includes('automatic') || cleanParam.includes('auto')) {
            for (let j = 0; j < transSelect.options.length; j++) {
              if (transSelect.options[j].text.toLowerCase().includes('automatic')) {
                transSelect.selectedIndex = j;
                break;
              }
            }
          } else if (cleanParam.includes('manual')) {
            for (let j = 0; j < transSelect.options.length; j++) {
              if (transSelect.options[j].text.toLowerCase().includes('manual')) {
                transSelect.selectedIndex = j;
                break;
              }
            }
          }
        }
      }
    }
  } catch {}

  // Auto-synchronize transmission when course dropdown changes
  const courseDropdown = document.getElementById('booking-course');
  const transDropdown = document.getElementById('booking-trans');
  if (courseDropdown && transDropdown) {
    courseDropdown.addEventListener('change', () => {
      const selected = courseDropdown.value.toLowerCase();
      if (selected.includes('motorcycle') || selected.includes('cbt')) {
        for (let j = 0; j < transDropdown.options.length; j++) {
          if (transDropdown.options[j].text.toLowerCase().includes('motorcycle')) {
            transDropdown.selectedIndex = j;
            break;
          }
        }
      } else if (selected.includes('automatic')) {
        for (let j = 0; j < transDropdown.options.length; j++) {
          if (transDropdown.options[j].text.toLowerCase().includes('automatic')) {
            transDropdown.selectedIndex = j;
            break;
          }
        }
      }
    });
  }

  // ============================================================================
  // Interactive Driving Lesson Booking Form Engine
  // ============================================================================
  const bookingForm = document.querySelector('[data-booking-form]');
  if (bookingForm) {
    let isBookingSubmitting = false;
    const submitBtn = document.getElementById('bookingSubmitBtn') || bookingForm.querySelector('button[type="submit"]');
    const originalSubmitHtml = submitBtn ? submitBtn.innerHTML : 'Schedule Your Driving Lesson &rarr;';
    const statusBox = document.getElementById('bookingStatus');

    // Validation definitions & field rules
    const validators = {
      'booking-name': (val) => {
        if (!val) return 'Please enter your full name.';
        if (val.length < 2 || !/[a-zA-Z]/.test(val)) return 'Please enter a valid full name (at least 2 letters).';
        return null;
      },
      'booking-email': (val) => {
        if (!val) return 'Please enter your email address.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(val)) return 'Please enter a valid email address (e.g. learner@example.com).';
        return null;
      },
      'booking-phone': (val) => {
        if (!val) return 'Please enter your phone number.';
        const digits = val.replace(/\D/g, '');
        if (digits.length < 10) return 'Please enter a valid telephone number with area code (at least 10 digits).';
        return null;
      },
      'booking-address': (val) => {
        if (!val) return 'Please enter your doorstep pickup address or city.';
        if (val.length < 5) return 'Please enter a complete street address or college campus pickup location.';
        return null;
      },
      'booking-course': (val) => {
        if (!val) return 'Please select a training program.';
        return null;
      },
      'booking-permit': (val) => {
        if (!val) return 'Please select your current driving permit or license status.';
        return null;
      },
      'booking-trans': (val) => {
        if (!val) return 'Please select your preferred transmission.';
        return null;
      },
      'booking-schedule': (val) => {
        if (!val) return 'Please select your preferred lesson time window.';
        return null;
      },
      'booking-date': (val) => {
        if (val) {
          const selected = new Date(`${val}T00:00:00`);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selected <= today) {
            return 'Target start date must be tomorrow or later.';
          }
        }
        return null;
      }
    };

    const clearFieldError = (field) => {
      field.classList.remove('is-invalid');
      field.removeAttribute('aria-invalid');
      const container = field.closest('.field');
      if (container) container.classList.remove('has-error');
      const errorMsg = document.getElementById(`${field.id}-error`);
      if (errorMsg) errorMsg.textContent = '';
    };

    const showFieldError = (field, message) => {
      field.classList.add('is-invalid');
      field.setAttribute('aria-invalid', 'true');
      const container = field.closest('.field');
      if (container) container.classList.add('has-error');
      const errorMsg = document.getElementById(`${field.id}-error`);
      if (errorMsg) errorMsg.textContent = message;
    };

    const validateFieldById = (id) => {
      const field = document.getElementById(id);
      if (!field || !validators[id]) return true;
      const error = validators[id](field.value.trim());
      if (error) {
        showFieldError(field, error);
        return false;
      } else {
        clearFieldError(field);
        return true;
      }
    };

    // Attach real-time correction listeners to all validated inputs
    Object.keys(validators).forEach(id => {
      const field = document.getElementById(id);
      if (field) {
        field.addEventListener('input', () => {
          clearFieldError(field);
          if (statusBox && statusBox.querySelector('.booking-error-card')) {
            statusBox.innerHTML = '';
          }
        });
        field.addEventListener('change', () => {
          clearFieldError(field);
        });
        field.addEventListener('blur', () => {
          if (field.value.trim()) {
            validateFieldById(id);
          }
        });
      }
    });

    // Handle interactive form submission
    bookingForm.addEventListener('submit', async event => {
      event.preventDefault();

      // Prevent accidental duplicate submissions
      if (isBookingSubmitting) return;

      // Validate all fields
      let isFormValid = true;
      let firstInvalid = null;

      Object.keys(validators).forEach(id => {
        const field = document.getElementById(id);
        if (field) {
          const isValid = validateFieldById(id);
          if (!isValid) {
            isFormValid = false;
            if (!firstInvalid) firstInvalid = field;
          }
        }
      });

      if (!isFormValid) {
        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.scrollIntoView({ behavior: scrollBehavior, block: 'center' });
        }
        if (statusBox) {
          statusBox.innerHTML = `
            <div class="booking-error-card" role="alert">
              <h4>⚠️ Incomplete or Invalid Entries</h4>
              <p>Please review the fields highlighted in red above and provide valid information before submitting.</p>
            </div>
          `;
        }
        return;
      }

      // Start submission process
      isBookingSubmitting = true;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.setAttribute('aria-busy', 'true');
        submitBtn.innerHTML = '<span class="btn-spinner" aria-hidden="true"></span> Submitting Lesson Request...';
      }
      if (statusBox) statusBox.innerHTML = '';

      // Collect data
      const formData = new FormData(bookingForm);
      const name = String(formData.get('name') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const phone = String(formData.get('phone') || '').trim();
      const address = String(formData.get('address') || '').trim();
      const course = String(formData.get('course') || '').trim();
      const permit = String(formData.get('permit') || '').trim();
      const transmission = String(formData.get('transmission') || '').trim();
        const instructor = String(formData.get('instructor') || 'No preference').trim();
      const schedule = String(formData.get('schedule') || 'Flexible Daytime').trim();
      const date = String(formData.get('date') || 'Flexible Start Date').trim();
      const notes = String(formData.get('notes') || '').trim();

      const config = (typeof window !== 'undefined' && window.DRIVEPRO_CONFIG) ? window.DRIVEPRO_CONFIG : {};
      const apiEndpoint = config.integration?.apiEndpoint || null;

      try {
        if (!apiEndpoint) {
          if (statusBox) {
            statusBox.innerHTML = `
              <div class="booking-error-card" role="status">
                <h4>Request not submitted</h4>
                <p>Your request was not submitted. Please try again later.</p>
              </div>
            `;
            statusBox.scrollIntoView({ behavior: scrollBehavior, block: 'nearest' });
          }
          return;
        }

        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, address, course, permit, transmission, instructor, schedule, date, notes })
        });
        if (!response.ok) {
          throw new Error(`The booking service returned HTTP ${response.status}. Please try again later.`);
        }

        let bookingRef = '';
        try {
          const result = await response.json();
          bookingRef = String(result.reference || result.id || '').trim();
        } catch {}

        if (statusBox) {
          statusBox.innerHTML = `
            <div class="booking-confirmation-card" role="status">
              <h4>Booking request submitted</h4>
              <p>Your request for <strong>${escapeHtml(course)}</strong> was accepted by the booking service.</p>
              ${bookingRef ? `<p>Reference: <strong>${escapeHtml(bookingRef)}</strong></p>` : ''}
            </div>
          `;
          statusBox.scrollIntoView({ behavior: scrollBehavior, block: 'nearest' });
        }
        bookingForm.reset();
      } catch (err) {
        if (statusBox) {
          statusBox.innerHTML = `
            <div class="booking-error-card" role="alert">
              <h4>Booking submission failed</h4>
              <p>${escapeHtml(err.message || 'The booking service could not receive your request. Please try again later.')}</p>
              <p>Your entries remain in the form. No request was confirmed.</p>
            </div>
          `;
          statusBox.scrollIntoView({ behavior: scrollBehavior, block: 'nearest' });
        }
      } finally {
        isBookingSubmitting = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.removeAttribute('aria-busy');
          submitBtn.innerHTML = originalSubmitHtml;
        }
      }
    });
  }

  // Helper escape function for HTML rendering
  function escapeHtml(str) {
    return String(str ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // Auth Forms Handler (Login & Register)
  document.querySelectorAll('[data-auth-form]').forEach(form => {
    let isAuthSubmitting = false;
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (isAuthSubmitting) return;
      if (!form.reportValidity()) return;

      const submitBtn = form.querySelector('.auth-submit');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Continue';
      const status = form.querySelector('[data-auth-status]');

      isAuthSubmitting = true;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="btn-spinner" aria-hidden="true"></span> ${form.dataset.authForm === 'register' ? 'Creating account...' : 'Signing in...'}`;
      }

      await new Promise(r => setTimeout(r, 400));

      const values = Object.fromEntries(new FormData(form).entries());
      const email = String(values.email || '').trim().toLowerCase();
      try {
        const accounts = JSON.parse(localStorage.getItem('drivepro-accounts') || '{}') || {};
        if (form.dataset.authForm === 'register') {
          if (accounts[email]) {
            if (status) status.textContent = 'An account with this email already exists. Sign in instead.';
            isAuthSubmitting = false;
            if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalText; }
            return;
          }
          accounts[email] = { name: values.name, phone: values.phone, course: values.course };
          localStorage.setItem('drivepro-accounts', JSON.stringify(accounts));
        } else if (!accounts[email]) {
          // Preload student account for local testing with alex@example.com
          if (email === 'alex@example.com' || email === 'alex.m@example.com') {
            accounts[email] = { name: 'Alex Morgan', phone: '(555) 392-1084', course: 'Beginner Car 20h Standard' };
            localStorage.setItem('drivepro-accounts', JSON.stringify(accounts));
          } else {
            if (status) status.textContent = 'We could not find an account with that email. Create an account to continue.';
            isAuthSubmitting = false;
            if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalText; }
            return;
          }
        }
        sessionStorage.setItem('drivepro-current-user', JSON.stringify({ email, name: accounts[email]?.name || email.split('@')[0], role: 'student' }));
        location.href = 'student-dashboard.html';
      } catch {
        if (status) status.textContent = 'Your account could not be created. Please try again.';
        isAuthSubmitting = false;
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalText; }
      }
    });
  });

  document.querySelectorAll('[data-disabled-action]').forEach(el => {
    el.addEventListener('click', e => e.preventDefault());
  });
});
