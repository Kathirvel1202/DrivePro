const headerSlot = document.getElementById('siteHeader');
const footerSlot = document.getElementById('siteFooter');
const page = document.body.dataset.page || '';

const dropdown = (title, items) => `
  <details class="nav-dropdown ${items.some(item => item.key === page) ? 'has-current' : ''}" name="primary-navigation">
    <summary class="nav-link ${items.some(item => item.key === page) ? 'active' : ''}">${title}</summary>
    <div class="dropdown-menu">
      ${items.map(item => `
        <a class="dropdown-link ${item.key === page ? 'active' : ''}" href="${item.url}" ${item.key === page ? 'aria-current="page"' : ''}>
          ${item.label}
        </a>
      `).join('')}
    </div>
  </details>
`;

const direct = (label, url, key) => `
  <a class="nav-link ${page === key ? 'active' : ''}" href="${url}" ${page === key ? 'aria-current="page"' : ''}>
    ${label}
  </a>
`;

if (headerSlot) {
  headerSlot.innerHTML = `
    <header class="site-header">
      <!-- Main Navigation Bar -->
      <nav class="navbar" aria-label="Main navigation">
        <a class="brand" href="index.html">
          <img class="brand-logo" src="assets/icons/drivepro-mark.svg" alt="DrivePro Logo">
          <div class="brand-text">
            <span class="brand-name">DrivePro</span>
            <span class="brand-tagline">Driving &amp; License Center</span>
          </div>
        </a>

        <button class="menu-toggle" id="menuToggle" type="button" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mainNavigation">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </button>

        <div class="nav-links" id="mainNavigation">
          ${dropdown('Home', [
            { label: 'Home 1 — Academy Overview', url: 'index.html', key: 'home' },
            { label: 'Home 2 — Fast-Track & Intensive', url: 'home-page-2.html', key: 'home-page-2' }
          ])}
          ${direct('Courses', 'courses.html', 'courses')}
          ${direct('Instructors', 'instructors.html', 'instructors')}
          ${direct('Pricing', 'pricing.html', 'pricing')}
          ${direct('About Us', 'about.html', 'about')}
          ${direct('FAQ', 'faq.html', 'faq')}
          ${direct('Contact', 'contact.html', 'contact')}
          ${dropdown('Portal', [
            { label: 'Student Dashboard', url: 'student-dashboard.html', key: 'student-dashboard' },
            { label: 'Instructor Dashboard', url: 'instructor-dashboard.html', key: 'instructor-dashboard' },
            { label: 'Admin Dashboard', url: 'admin-dashboard.html', key: 'admin-dashboard' }
          ])}
          
          <div class="mobile-nav-cta">
            <a class="mobile-book-btn" href="contact.html#book">Book a Driving Lesson</a>
            <div class="mobile-contact-info">
              <a href="tel:+18005550199">📞 Call: (800) 555-0199</a>
              <span>🕒 Lessons 7 Days a Week</span>
            </div>
          </div>
        </div>

        <div class="nav-actions nav-utilities">
          <button class="theme-toggle" id="themeToggle" type="button" aria-label="Switch to dark theme" aria-pressed="false">
            <span class="theme-toggle-circle"></span>
            <span class="theme-icon" aria-hidden="true">☼</span>
          </button>
          <button class="language-btn" id="directionToggle" type="button" aria-label="Switch to right-to-left direction" aria-pressed="false">LTR</button>
          <span class="nav-separator" aria-hidden="true"></span>
          <a class="login-btn" href="login.html">Login</a>
          <a class="header-book-btn" href="contact.html#book">Book a Lesson</a>
        </div>
      </nav>
    </header>
  `;
}

if (footerSlot) {
  footerSlot.innerHTML = `
    <footer class="site-footer">
      <!-- Main Footer Grid -->
      <div class="footer-main">
        <!-- Col 1: Brand & Contact Info -->
        <div class="footer-brand">
          <a class="footer-brand-link" href="index.html">
            <img class="footer-logo" src="assets/icons/drivepro-mark.svg" alt="DrivePro Logo">
            <div>
              <span class="footer-brand-name">DrivePro</span>
              <small class="footer-brand-sub">Driving School &amp; License Training Center</small>
            </div>
          </a>
          <p>Government-accredited driver education offering patient, safety-first 1-on-1 dual-control instruction, motorcycle certification, and road test preparation for all skill levels.</p>
          
          <div class="footer-contact-block">
            <div class="footer-contact-row">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span><strong>Phone:</strong> <a href="tel:+18005550199">(800) 555-0199</a></span>
            </div>
            <div class="footer-contact-row">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              <span><strong>Admissions:</strong> <a href="mailto:admissions@driveproacademy.com">admissions@driveproacademy.com</a></span>
            </div>
            <div class="footer-contact-row">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span><strong>Center:</strong> 420 Motorway Blvd, Training Grounds &amp; Test Center</span>
            </div>
            <div class="footer-contact-row">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span><strong>Hours:</strong> Mon–Sat: 7:00 AM – 8:00 PM | Sun: 8:00 AM – 4:00 PM</span>
            </div>
          </div>

          <div class="footer-socials" aria-label="Social media">
            <a href="https://www.linkedin.com" aria-label="LinkedIn" title="LinkedIn" target="_blank" rel="noopener noreferrer">in</a>
            <a href="https://www.instagram.com" aria-label="Instagram" title="Instagram" target="_blank" rel="noopener noreferrer">◎</a>
            <a href="https://www.facebook.com" aria-label="Facebook" title="Facebook" target="_blank" rel="noopener noreferrer">f</a>
            <a href="https://x.com" aria-label="X" title="X" target="_blank" rel="noopener noreferrer">𝕏</a>
          </div>
        </div>

        <!-- Col 2: Training Courses -->
        <nav class="footer-links" aria-label="Training Courses">
          <h2>Training Courses</h2>
          <a href="courses.html">All Courses Overview</a>
          <a href="courses.html#car-courses">Beginner Car Driving (Class D / B)</a>
          <a href="courses.html#automatic-courses">Automatic Transmission Course</a>
          <a href="courses.html#motorcycle-courses">Motorcycle &amp; CBT Training (Class M)</a>
          <a href="courses.html#intensive-courses">Fast-Track Intensive License Prep</a>
          <a href="courses.html#refresher-courses">Refresher &amp; Nervous Driver Lessons</a>
          <a href="courses.html#commercial-courses">Commercial Delivery Van Training</a>
        </nav>

        <!-- Col 3: Learners & School -->
        <nav class="footer-links" aria-label="Learner Resources">
          <h2>Learners &amp; School</h2>
          <a href="instructors.html">Certified Instructors Directory</a>
          <a href="pricing.html">Pricing &amp; Course Packages</a>
          <a href="course-details.html">Flagship Syllabus Details</a>
          <a href="about.html">About DrivePro Academy</a>
          <a href="faq.html">Frequently Asked Questions</a>
          <a href="contact.html#book">Book a Driving Lesson</a>
          <a href="contact.html">Contact &amp; Map Location</a>
        </nav>

        <!-- Col 4: Portals & Accreditation -->
        <div class="footer-portals">
          <h2>Portals &amp; Safety</h2>
          <div class="footer-portal-links">
            <a class="footer-portal-btn" href="student-dashboard.html">
              <span>🎓 Student Portal</span>
              <small>Log in to track hours &amp; lessons</small>
            </a>
            <a class="footer-portal-btn" href="instructor-dashboard.html">
              <span>🚗 Instructor Portal</span>
              <small>Schedules &amp; student notes</small>
            </a>
            <a class="footer-portal-btn" href="admin-dashboard.html">
              <span>⚙️ Admin Portal</span>
              <small>School management</small>
            </a>
          </div>

          <div class="footer-accreditation-card">
            <strong>DMV &amp; DVSA Approved Facility</strong>
            <p>Accreditation Code: #DP-94821. All vehicles fitted with dual-control safety pedals and front/rear telemetry cameras.</p>
          </div>
        </div>
      </div>

      <!-- Footer Bottom Bar -->
      <div class="footer-bottom">
        <p>© 2026 DrivePro Driving School &amp; License Training Center. All rights reserved.</p>
        <div>
          <a href="contact.html">Safety Guarantee</a>
          <a href="contact.html">Terms &amp; Conditions</a>
          <a href="faq.html">Privacy Policy</a>
          <a href="contact.html">Road Test Booking Help</a>
        </div>
      </div>
    </footer>
  `;
}
