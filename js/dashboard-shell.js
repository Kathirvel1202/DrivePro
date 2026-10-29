(() => {
  const body = document.body;
  const role = body.dataset.portalRole;
  if (!role) return;

  const studentLinks = [
    ['Overview', 'student-dashboard.html', '⌂'],
    ['My Courses', 'student-courses.html', '▤'],
    ['My Lessons', 'student-lessons.html', '◷'],
    ['Driving Progress', 'student-progress.html', '↗'],
    ['Fees & Invoices', 'student-fees.html', '$'],
    ['Profile Settings', 'student-settings.html', '⚙'],
  ];
  const adminLinks = [
    ['Overview', 'admin-dashboard.html', '⌂'],
    ['Student Management', 'admin-students.html', '👥'],
    ['Instructor Management', 'admin-instructors.html', '🎓'],
    ['Course Management', 'admin-courses.html', '📋'],
    ['Lesson Scheduling', 'admin-scheduling.html', '📅'],
    ['Vehicle Management', 'admin-vehicles.html', '🚗'],
    ['Fees & Invoices', 'admin-fees.html', '$'],
    ['Reports', 'admin-reports.html', '📊'],
    ['Account Settings', 'admin-settings.html', '⚙'],
  ];

  const admin = role === 'admin';
  const links = admin ? adminLinks : studentLinks;
  const current = location.pathname.split('/').pop() || (admin ? 'admin-dashboard.html' : 'student-dashboard.html');
  const main = document.querySelector('main');
  if (main) {
    main.id = 'main-content';
    const skipLink = document.createElement('a');
    skipLink.className = 'skip-link';
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    body.insertBefore(skipLink, body.firstChild);
  }
  const sidebar = document.getElementById('portalSidebar');
  const topbar = document.getElementById('portalTopbar');

  if (sidebar) {
    sidebar.innerHTML = `<a class="portal-brand" href="index.html"><img src="assets/icons/drivepro-mark.svg" alt=""><span>DrivePro</span></a>
      <nav class="portal-nav" aria-label="${admin ? 'Admin' : 'Student'} dashboard">
        ${links.map(([label, href, icon]) => `<a href="${href}"${href === current ? ' class="is-active" aria-current="page"' : ''}><span class="portal-nav-icon" aria-hidden="true">${icon}</span>${label}</a>`).join('')}
      </nav>
      <div class="portal-sidebar-bottom"><a class="portal-logout" href="login.html"><span class="portal-nav-icon" aria-hidden="true">↪</span>Logout</a></div>`;
  }

  if (topbar) {
    topbar.innerHTML = `<span class="portal-topbar-label">${admin ? 'Administration' : 'Student portal'}</span>
      <button class="portal-menu-toggle" id="portalMenuToggle" type="button" aria-controls="portalSidebar" aria-expanded="false">Menu</button>
      <div class="portal-controls">
        <button class="theme-toggle" id="themeToggle" type="button" aria-label="Switch to dark theme" aria-pressed="false"><span class="theme-toggle-circle"></span><span class="theme-icon" aria-hidden="true">☼</span></button>
        <button class="language-btn" id="directionToggle" type="button" aria-label="Switch to right-to-left direction" aria-pressed="false">LTR</button>
      </div>
      <div class="portal-topbar-profile"><span class="portal-avatar" aria-hidden="true">${admin ? '⚙' : '♙'}</span><div class="portal-profile-copy"><strong>${admin ? 'Administrator' : 'Student account'}</strong><span>${admin ? 'School operations' : 'Learning portal'}</span></div></div>`;
  }

  if (main && topbar) {
    const portalNotice = document.createElement('p');
    portalNotice.className = 'portal-inline-note';
    portalNotice.setAttribute('role', 'note');
    portalNotice.textContent = 'Portal access is not protected by a secure service. Records are stored only in this browser.';
    main.insertBefore(portalNotice, topbar.nextSibling);
  }

  const appScript = document.createElement('script');
  appScript.src = new URL('dashboard-app.js', document.currentScript.src).href;
  document.head.append(appScript);
})();
