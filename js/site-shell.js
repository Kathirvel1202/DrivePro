const headerSlot = document.getElementById('siteHeader');
const footerSlot = document.getElementById('siteFooter');
const page = document.body.dataset.page || '';

const dropdown = (title, items) => {
  const isCurrent = items.some(item => item.key === page);
  return `
  <details class="nav-dropdown ${isCurrent ? 'has-current' : ''}" name="primary-navigation">
    <summary class="nav-link ${isCurrent ? 'active' : ''}">${title}</summary>
    <div class="dropdown-menu">
      ${items.map(item => `
        <a class="dropdown-link ${item.key === page ? 'active' : ''}" href="${item.url}" ${item.key === page ? 'aria-current="page"' : ''}>
          ${item.label}
        </a>
      `).join('')}
    </div>
  </details>
  `;
};

const direct = (label, url, key) => `
  <a class="nav-link ${page === key ? 'active' : ''}" href="${url}" ${page === key ? 'aria-current="page"' : ''}>
    ${label}
  </a>
`;

if (headerSlot) {
  headerSlot.innerHTML = `
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <header class="site-header">
      <!-- Main Navigation Bar -->
      <nav class="navbar" aria-label="Main navigation">
        <a class="brand" href="index.html">
          <img class="brand-logo" src="assets/icons/drivepro-mark.svg" alt="">
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
            { label: 'Home 1', url: 'index.html', key: 'home' },
            { label: 'Home 2', url: 'home-page-2.html', key: 'home-page-2' }
          ])}
          ${direct('Courses', 'courses.html', 'courses')}
          ${direct('Instructors', 'instructors.html', 'instructors')}
          ${direct('Pricing', 'pricing.html', 'pricing')}
          ${direct('About Us', 'about.html', 'about')}
          ${direct('FAQ', 'faq.html', 'faq')}
          ${direct('Contact', 'contact.html', 'contact')}
          ${dropdown('Portal', [
            { label: 'Student Dashboard', url: 'student-dashboard.html', key: 'student-dashboard' },
            { label: 'Admin Dashboard', url: 'admin-dashboard.html', key: 'admin-dashboard' }
          ])}
          
          <div class="mobile-nav-cta">
            <a class="mobile-book-btn" href="contact.html#book">Book a Driving Lesson</a>
            <p class="mobile-contact-info">Explore courses, lesson planning, and school information.</p>
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
        </div>
      </nav>
    </header>
  `;
}

document.querySelector('main')?.setAttribute('id', 'main-content');

if (footerSlot) {
  footerSlot.innerHTML = `
    <footer class="site-footer">
      <!-- Main Footer Grid -->
      <div class="footer-main">
        <!-- Col 1: Brand & Contact Info -->
        <div class="footer-brand">
          <a class="footer-brand-link" href="index.html">
            <img class="footer-logo" src="assets/icons/drivepro-mark.svg" alt="">
            <div>
              <span class="footer-brand-name">DrivePro</span>
              <small class="footer-brand-sub">Driving School &amp; License Training Center</small>
            </div>
          </a>
          <p>Explore lesson formats, course information, and instructor profiles. Confirm current services and availability with the school before making plans.</p>
          
          <p class="footer-contact-block">Browse courses, review common questions, and plan a lesson.</p>
          <nav class="footer-socials" aria-label="Social platforms">
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram homepage">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.8" r="1.2" fill="currentColor"/></svg>
            </a>
            <a href="https://x.com/" target="_blank" rel="noopener noreferrer" aria-label="X homepage"><span aria-hidden="true">𝕏</span></a>
            <a href="https://www.whatsapp.com/" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp homepage">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.7a8 8 0 0 1-11.8 7L4 20l1.3-4A8 8 0 1 1 20 11.7Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 8.5c.4 2.1 2.4 4.1 4.5 4.5l1-1 2 1c-.3 1.5-1.2 2.2-2.7 2.1-3.5-.5-6.5-3.5-7-7-.1-1.5.6-2.4 2.1-2.7l1 2-0.9 1.1Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
            </a>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook homepage"><span aria-hidden="true">f</span></a>
          </nav>
        </div>

        <!-- Col 2: Training Courses -->
        <nav class="footer-links" aria-label="Training Courses">
          <h2>Training Courses</h2>
          <a href="courses.html">All Courses Overview</a>
          <a href="courses.html#car-courses">Beginner Car Driving (Class D)</a>
          <a href="courses.html#automatic-courses">Automatic Transmission Course</a>
          <a href="courses.html#motorcycle-courses">Motorcycle Training (Class M)</a>
          <a href="courses.html#intensive-courses">Fast-Track Intensive License Prep</a>
          <a href="courses.html#refresher-courses">Refresher &amp; Nervous Driver Lessons</a>
          <a href="courses.html#commercial-courses">Commercial Delivery Van Training</a>
        </nav>

        <!-- Col 3: Learners & School -->
        <nav class="footer-links" aria-label="Learner Resources">
          <h2>Learners &amp; School</h2>
          <a href="instructors.html">Instructor Profiles</a>
          <a href="pricing.html">Pricing &amp; Course Packages</a>
          <a href="course-details.html">Flagship Syllabus Details</a>
          <a href="about.html">About DrivePro Academy</a>
          <a href="faq.html">Frequently Asked Questions</a>
          <a href="contact.html#book">Book a Driving Lesson</a>
          <a href="contact.html">Contact &amp; Map Location</a>
        </nav>

        <!-- Col 4: Portals & Accreditation -->
        <div class="footer-portals">
          <h2>Portals &amp; Information</h2>
          <div class="footer-portal-links">
            <a class="footer-portal-btn" href="student-dashboard.html">
              <span>🎓 Student Portal</span>
              <small>Log in to track hours &amp; lessons</small>
            </a>
            <a class="footer-portal-btn" href="admin-dashboard.html">
              <span>⚙️ Admin Portal</span>
              <small>School management</small>
            </a>
          </div>

        </div>
      </div>

      <!-- Footer Bottom Bar -->
      <div class="footer-bottom">
        <p>&copy; 2026 DrivePro Driving School &amp; License Training Center. All rights reserved.</p>
        <div>
          <span>Student and school resources</span>
          <a href="faq.html">Frequently Asked Questions</a>
          <a href="contact.html">Contact page</a>
        </div>
      </div>
    </footer>
  `;
}
