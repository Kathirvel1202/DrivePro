(() => {
  const body = document.body;
  if (!body.dataset.portalRole) return;
  const scrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

  const configs = {
    'student-dashboard': { title: 'Personal notes', help: 'Keep notes about your learning plan.', collection: 'student-notes', fields: [['title','Note title','text',true],['category','Category','select',['Course','Lesson','Progress','Account']],['notes','Notes','text',true]], filter: 'category' },
    'student-courses': { title: 'Course records', help: 'Add or update course information.', collection: 'student-courses', fields: [['course','Course name','text',true],['license','License type','text',true],['status','Status','select',['Considering','Requested','Enrolled','Completed']],['notes','Notes','text',false]], filter: 'status' },
    'student-lessons': { title: 'Lesson planner', help: 'Keep lesson requests and personal schedule notes.', collection: 'student-lessons', fields: [['date','Date','date',true],['time','Time','time',true],['duration','Duration (minutes)','number',true],['instructor','Instructor','text',false],['status','Status','select',['Requested','Scheduled','Completed','Cancelled']],['notes','Notes','text',false]], filter: 'status' },
    'student-progress': { title: 'Personal training log', help: 'Record your own practice notes. These entries are not instructor-verified hours.', collection: 'student-progress', fields: [['date','Date','date',true],['type','Training type','select',['Theory','Practical']],['hours','Hours','number',true],['notes','Learning notes','text',false]], filter: 'type' },
    'student-fees': { title: 'Fee notes', help: 'Keep your own reference notes. No payment is processed here.', collection: 'student-fees', fields: [['date','Date','date',true],['reference','Reference','text',true],['description','Description','text',true],['amount','Amount','number',true],['status','Status','select',['To review','Due','Paid','Refund requested']]], filter: 'status' },
    'admin-dashboard': { title: 'Operations notes', help: 'Create follow-up notes for school operations.', collection: 'admin-actions', fields: [['title','Action title','text',true],['area','Area','select',['Students','Instructors','Courses','Scheduling','Vehicles','Fees','Reports']],['status','Status','select',['To do','In progress','Complete']],['notes','Notes','text',false]], filter: 'status' },
    'admin-students': { title: 'Student directory', help: 'Add and manage student entries.', collection: 'admin-students', fields: [['name','Student name','text',true],['email','Email','email',false],['phone','Phone','tel',false],['enrollment','Enrollment','select',['Not enrolled','Requested','Enrolled','Completed']],['course','Course','text',false],['status','Status','select',['Active','On hold','Inactive']]], filter: 'status', legacyFilters: [['Enrollment','enrollment',['Not enrolled','Requested','Enrolled','Completed']],['Status','status',['Active','On hold','Inactive']] ] },
    'admin-instructors': { title: 'Instructor directory', help: 'Add and manage instructor information and availability.', collection: 'admin-instructors', fields: [['name','Instructor name','text',true],['email','Email','email',false],['specialisation','Specialisation','text',true],['qualifications','Qualifications','text',false],['vehicleCategories','Vehicle categories','text',false],['availability','Availability','select',['Available','Limited','Unavailable']]], filter: 'availability', legacyFilters: [['Specialisation','specialisation',['Car','Motorcycle','Commercial','Other']],['Availability','availability',['Available','Limited','Unavailable']] ] },
    'admin-courses': { title: 'Course catalogue', help: 'Create and maintain course details.', collection: 'admin-courses', fields: [['course','Course name','text',true],['license','License type','text',true],['eligibility','Eligibility','text',false],['theoryHours','Theory hours','number',false],['practicalHours','Practical hours','number',false],['duration','Duration','text',false],['price','Price','number',false],['status','Availability','select',['Draft','Available','Unavailable']]], filter: 'status', legacyFilters: [['License type','license',['Car','Motorcycle','Commercial','Other']],['Availability','status',['Draft','Available','Unavailable']] ] },
    'admin-scheduling': { title: 'Lesson schedule', help: 'Plan and update lesson schedule entries.', collection: 'admin-scheduling', fields: [['date','Date','date',true],['time','Time','time',true],['student','Student','text',true],['instructor','Instructor','text',false],['vehicle','Vehicle','text',false],['duration','Duration (minutes)','number',false],['status','Status','select',['Requested','Scheduled','Completed','Cancelled']]], filter: 'status' },
    'admin-vehicles': { title: 'Vehicle directory', help: 'Add and maintain vehicle and safety records.', collection: 'admin-vehicles', fields: [['registration','Registration','text',true],['category','Category','text',true],['transmission','Transmission','select',['Manual','Automatic','Other']],['availability','Availability','select',['Available','Assigned','Maintenance']],['maintenance','Maintenance notes','text',false]], filter: 'availability' },
    'admin-fees': { title: 'Fee and invoice records', help: 'Maintain billing references and refund records.', collection: 'admin-fees', fields: [['type','Record type','select',['Invoice','Payment record','Refund request']],['reference','Reference','text',true],['student','Student','text',false],['date','Date','date',false],['description','Description','text',true],['amount','Amount','number',true],['status','Status','select',['Pending','Due','Paid','Refund requested','Refunded']]], filter: 'status' },
  };
  const reportSources = [
    ['admin-students','Students'],['admin-instructors','Instructors'],['admin-courses','Courses'],
    ['admin-scheduling','Lessons'],['admin-vehicles','Vehicles'],['admin-fees','Fees and invoices'],
  ];
  const defaultStore = {
    'admin-students': [
      { id: 'std-1', name: 'Alex Morgan', email: 'alex.m@example.com', phone: '(555) 392-1084', enrollment: 'Enrolled', course: 'Beginner Car 20h Standard', status: 'Active' },
      { id: 'std-2', name: 'Chloe Mitchell', email: 'chloe.m@example.com', phone: '(555) 782-9301', enrollment: 'Enrolled', course: 'Automatic Hybrid Suite', status: 'Active' },
      { id: 'std-3', name: 'Liam Turner', email: 'liam.t@example.com', phone: '(555) 441-2910', enrollment: 'Completed', course: 'Fast-Track Intensive (Class D)', status: 'Active' },
      { id: 'std-4', name: 'Carlos Rodriguez', email: 'carlos.r@example.com', phone: '(555) 602-1829', enrollment: 'Enrolled', course: 'Motorcycle CBT (Class M)', status: 'Active' },
      { id: 'std-5', name: 'Emma Watson', email: 'emma.w@example.com', phone: '(555) 819-2041', enrollment: 'Enrolled', course: '10-Hour Fast-Track Prep', status: 'Active' }
    ],
    'admin-instructors': [
      { id: 'ins-1', name: 'David Miller', email: 'david.m@driveproacademy.com', specialisation: 'Car (Manual)', qualifications: 'State Master Instructor, Advanced Safety Gold', vehicleCategories: 'Class D (Manual)', availability: 'Available' },
      { id: 'ins-2', name: 'Sarah Jenkins', email: 'sarah.j@driveproacademy.com', specialisation: 'Car (Automatic)', qualifications: 'State Certified Instructor, EV Specialist', vehicleCategories: 'Class D (Auto)', availability: 'Available' },
      { id: 'ins-3', name: 'Marcus Vance', email: 'marcus.v@driveproacademy.com', specialisation: 'Motorcycle', qualifications: 'State Certified Motorcycle Instructor (MSF)', vehicleCategories: 'Class M (Motorcycle)', availability: 'Available' },
      { id: 'ins-4', name: 'Elena Rostova', email: 'elena.r@driveproacademy.com', specialisation: 'Defensive & Refresher', qualifications: 'Advanced Police Driving Cert', vehicleCategories: 'Class D, Refresher', availability: 'Available' },
      { id: 'ins-5', name: 'James Thornton', email: 'james.t@driveproacademy.com', specialisation: 'Nervous Beginners', qualifications: 'Clinical Patient Coaching', vehicleCategories: 'Class D (Dual-Control)', availability: 'Available' },
      { id: 'ins-6', name: 'Priya Sharma', email: 'priya.s@driveproacademy.com', specialisation: 'Commercial Fleet', qualifications: 'Commercial Driver Senior Instructor', vehicleCategories: 'Class C1 (Commercial)', availability: 'Available' }
    ],
    'admin-courses': [
      { id: 'crs-1', course: 'Beginner Car 20h Standard', license: 'Class D (Manual)', eligibility: 'Age 17+, Provisional Permit', theoryHours: 10, practicalHours: 20, duration: '2-4 Weeks', price: 750, status: 'Available' },
      { id: 'crs-2', course: 'Automatic Hybrid Suite (20h)', license: 'Class D (Automatic)', eligibility: 'Age 17+, Provisional Permit', theoryHours: 10, practicalHours: 20, duration: '2-4 Weeks', price: 790, status: 'Available' },
      { id: 'crs-3', course: 'Fast-Track Intensive (15h)', license: 'Class D', eligibility: 'Age 17+, Theory Passed', theoryHours: 6, practicalHours: 15, duration: '1 Week', price: 620, status: 'Available' },
      { id: 'crs-4', course: 'Motorcycle CBT Course', license: 'Class M', eligibility: 'Age 16+', theoryHours: 4, practicalHours: 8, duration: '1 Day', price: 195, status: 'Available' },
      { id: 'crs-5', course: 'Full Motorcycle License (Class M)', license: 'Class M', eligibility: 'Age 18+, Permit or Skills Certificate', theoryHours: 8, practicalHours: 16, duration: '3-5 Days', price: 680, status: 'Available' },
      { id: 'crs-6', course: 'Defensive Driver Certification', license: 'Class D / Commercial', eligibility: 'Full License Holder', theoryHours: 6, practicalHours: 6, duration: '2 Days', price: 280, status: 'Available' },
      { id: 'crs-7', course: 'License Refresher Course (6h)', license: 'Class D', eligibility: 'Full License Holder', theoryHours: 2, practicalHours: 6, duration: '3 Days', price: 260, status: 'Available' },
      { id: 'crs-8', course: 'Commercial Delivery Van Training', license: 'Class C1', eligibility: 'Full Class D License', theoryHours: 8, practicalHours: 14, duration: '1 Week', price: 580, status: 'Available' }
    ],
    'admin-scheduling': [
      { id: 'sch-1', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], time: '09:00', student: 'Alex Morgan', instructor: 'David Miller', vehicle: 'VW Golf (DP24-GLF)', duration: 120, status: 'Scheduled' },
      { id: 'sch-2', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], time: '12:00', student: 'Chloe Mitchell', instructor: 'Sarah Jenkins', vehicle: 'Toyota Corolla (DP24-AUT)', duration: 120, status: 'Scheduled' },
      { id: 'sch-3', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], time: '15:00', student: 'Liam Turner', instructor: 'David Miller', vehicle: 'VW Golf (DP24-GLF)', duration: 120, status: 'Scheduled' },
      { id: 'sch-4', date: new Date(Date.now() + 172800000).toISOString().split('T')[0], time: '10:00', student: 'Carlos Rodriguez', instructor: 'Marcus Vance', vehicle: 'Yamaha MT-07 (DP23-MTR)', duration: 240, status: 'Scheduled' },
      { id: 'sch-5', date: new Date(Date.now() + 172800000).toISOString().split('T')[0], time: '14:00', student: 'Emma Watson', instructor: 'James Thornton', vehicle: 'Ford Puma (DP23-AUT)', duration: 120, status: 'Scheduled' }
    ],
    'admin-vehicles': [
      { id: 'veh-1', registration: 'DP24-GLF', category: 'Class D Dual-Control Car', transmission: 'Manual', availability: 'Assigned', maintenance: '2024 VW Golf 1.5 TSI • Dual He-Man Pedals' },
      { id: 'veh-2', registration: 'DP24-AUT', category: 'Class D Dual-Control Car', transmission: 'Automatic', availability: 'Available', maintenance: '2024 Toyota Corolla Hybrid • Dual Controls' },
      { id: 'veh-3', registration: 'DP23-MTR', category: 'Class M Training Motorcycle', transmission: 'Manual', availability: 'Available', maintenance: '2023 Yamaha MT-07 ABS • Crash Cages' },
      { id: 'veh-4', registration: 'DP23-PMA', category: 'Class D Dual-Control Car', transmission: 'Manual', availability: 'Available', maintenance: '2023 Ford Fiesta EcoBoost • Dual Controls' },
      { id: 'veh-5', registration: 'DP24-EV1', category: 'Class D Dual-Control Car', transmission: 'Automatic', availability: 'Available', maintenance: '2024 Tesla Model 3 • Dual Controls' },
      { id: 'veh-6', registration: 'DP22-VAN', category: 'Class C1 Commercial Delivery Van', transmission: 'Manual', availability: 'Available', maintenance: '2022 Ford Transit Custom 300' }
    ],
    'admin-fees': [
      { id: 'fee-1', type: 'Invoice', reference: 'INV-2026-1042', student: 'Alex Morgan', date: '2026-10-12', description: 'Beginner Car 20h Standard Package', amount: 750, status: 'Paid' },
      { id: 'fee-2', type: 'Invoice', reference: 'INV-2026-1043', student: 'Chloe Mitchell', date: '2026-10-14', description: 'Automatic Hybrid Suite (20h)', amount: 790, status: 'Paid' },
      { id: 'fee-3', type: 'Invoice', reference: 'INV-2026-1044', student: 'Liam Turner', date: '2026-10-16', description: 'Fast-Track Intensive (Class D)', amount: 620, status: 'Paid' },
      { id: 'fee-4', type: 'Invoice', reference: 'INV-2026-1045', student: 'Carlos Rodriguez', date: '2026-10-18', description: 'Motorcycle CBT Course', amount: 195, status: 'Paid' },
      { id: 'fee-5', type: 'Invoice', reference: 'INV-2026-1046', student: 'Emma Watson', date: '2026-10-20', description: '10-Hour Fast-Track Prep', amount: 450, status: 'Due' }
    ],
    'student-courses': [
      { id: 'sc-1', course: 'Beginner Car 20-Hour Standard Suite', license: 'Class D (Manual)', status: 'Enrolled', notes: '12 of 20 hours completed with David Miller. Next: Roundabouts & Priority.' },
      { id: 'sc-2', course: 'Official DMV Practical Road Test Package', license: 'Practical Test', status: 'Enrolled', notes: 'Scheduled for late November with school VW Golf (#DP24-GLF).' }
    ],
    'student-lessons': [
      { id: 'sl-1', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], time: '09:00', duration: 120, instructor: 'David Miller', status: 'Scheduled', notes: 'Roundabouts, Multi-lane entry, and Spiral markings' },
      { id: 'sl-2', date: new Date(Date.now() + 345600000).toISOString().split('T')[0], time: '10:00', duration: 120, instructor: 'David Miller', status: 'Scheduled', notes: 'Parallel Bay Parking & Emergency Stop' },
      { id: 'sl-3', date: '2026-10-26', time: '09:00', duration: 120, instructor: 'David Miller', status: 'Completed', notes: 'Mastered emerging from minor to major junctions with good observations.' }
    ],
    'student-progress': [
      { id: 'sp-1', date: '2026-10-26', type: 'Practical', hours: 2, notes: 'Mastered emerging into busy traffic without hesitation. Good clutch control.' },
      { id: 'sp-2', date: '2026-10-22', type: 'Practical', hours: 2, notes: 'Hill starts on 15% gradient with handbrake. Zero rollback.' },
      { id: 'sp-3', date: '2026-10-18', type: 'Practical', hours: 2, notes: 'Cockpit drill, blind-spot checks, smooth gear shifting 1-3.' }
    ],
    'student-fees': [
      { id: 'sf-1', date: '2026-10-12', reference: 'INV-2026-1042', description: 'Beginner Car 20h Standard Package (Class D Manual)', amount: 750, status: 'Paid' },
      { id: 'sf-2', date: '2026-10-22', reference: 'INV-2026-1088', description: 'DMV Practical Road Test Car Hire & Warmup Drive', amount: 90, status: 'Paid' }
    ],
    'admin-actions': [
      { id: 'aa-1', title: 'Inspect DP24-GLF Dual-Controls', area: 'Vehicles', status: 'Complete', notes: 'He-Man dual pedal cables adjusted and lubricated.' },
      { id: 'aa-2', title: 'Alex Morgan Mock Driving Test', area: 'Scheduling', status: 'In progress', notes: 'Target route 3 with Senior Instructor David Miller.' }
    ],
    'student-notes': [
      { id: 'sn-1', title: 'Roundabout Lane Positioning', category: 'Lesson', notes: 'Remember to check left mirror and blind spot before indicating to leave roundabout at second exit.' }
    ]
  };
  let store = {};
  try { store = JSON.parse(localStorage.getItem('drivepro-dashboard-workspace') || '{}') || {}; } catch { store = {}; }
  for (const [key, items] of Object.entries(defaultStore)) {
    if (!Array.isArray(store[key]) || store[key].length === 0) {
      store[key] = items;
    }
  }
  const saveStore = () => {
    try { localStorage.setItem('drivepro-dashboard-workspace', JSON.stringify(store)); return true; }
    catch { return false; }
  };
  saveStore();
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const makeId = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const addField = ([key,label,type,extra]) => {
    const required = typeof extra === 'boolean' ? extra : false;
    const options = Array.isArray(extra) ? extra : null;
    const input = options
      ? `<select name="${key}"${required?' required':''}><option value="">Choose ${label.toLowerCase()}</option>${options.map(value=>`<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join('')}</select>`
      : `<input name="${key}" type="${type}"${type==='number'?' min="0" step="any"':''}${required?' required':''}>`;
    return `<label class="portal-field">${label}${input}</label>`;
  };

  function attachWorkspace(config) {
    const main = document.querySelector('.portal-main');
    const welcome = main?.querySelector('.portal-welcome');
    if (!main || !welcome) return;
    const section = document.createElement('section');
    section.className = 'portal-panel portal-workspace portal-section';
    section.id = 'workspace';
    section.innerHTML = `<div class="portal-section-heading"><div><h2>${config.title}</h2><p>${config.help}</p></div><button class="portal-secondary-link" type="button" data-export>Export CSV</button></div>
      <form class="portal-form" data-record-form><input type="hidden" name="id"><div class="portal-form-grid">${config.fields.map(addField).join('')}</div><div class="portal-form-actions"><button class="portal-primary-action" type="submit">Add entry</button><button class="portal-secondary-link" type="button" data-cancel-edit hidden>Cancel edit</button></div></form>
      <div class="portal-workspace-tools"><label class="portal-field">Search entries<input type="search" data-search placeholder="Search ${config.title.toLowerCase()}"></label><label class="portal-field">Filter by ${escapeHtml(config.fields.find(f=>f[0]===config.filter)?.[1] || 'category')}<select data-filter><option value="">All entries</option>${(Array.isArray(config.fields.find(f=>f[0]===config.filter)?.[3])?config.fields.find(f=>f[0]===config.filter)[3]:[]).map(x=>`<option>${escapeHtml(x)}</option>`).join('')}</select></label></div>
      ${page==='student-progress'?'<p class="portal-personal-hours" data-hours-summary>Personal hours recorded: 0. This log is not instructor-verified.</p>':''}
      <p class="portal-inline-note" data-record-status aria-live="polite">Workspace records and management tools.</p><div class="portal-table-wrap"><table class="portal-table"><thead><tr>${config.fields.map(f=>`<th scope="col">${escapeHtml(f[1])}</th>`).join('')}<th scope="col">Actions</th></tr></thead><tbody data-record-rows></tbody></table></div>`;
    if(page==='admin-scheduling')section.dataset.calendarView='Monthly';
    const existingControls=document.querySelector('.portal-report-controls');
    if(existingControls&&(config.legacyFilters||page==='admin-scheduling')){
      const existingPanel=existingControls.closest('.portal-panel');
      const note=existingPanel?.querySelector('.portal-inline-note');
      section.querySelector('.portal-section-heading').insertAdjacentElement('afterend',existingControls);
      if(note)existingControls.insertAdjacentElement('afterend',note);
      if(existingPanel)existingPanel.hidden=true;
    }
    if(config.legacyFilters) section.querySelector('.portal-workspace-tools').hidden=true;
    welcome.insertAdjacentElement('afterend', section);
    if(!page.endsWith('-dashboard')){
      main.querySelectorAll(':scope > .portal-panel, :scope > .portal-section, :scope > .portal-grid-2').forEach(panel=>{if(panel!==section&&!panel.classList.contains('portal-added-section'))panel.hidden=true;});
    }
    const form=section.querySelector('[data-record-form]'), rows=section.querySelector('[data-record-rows]'), search=section.querySelector('[data-search]'), filter=section.querySelector('[data-filter]'), status=section.querySelector('[data-record-status]');
    const searchLegacy=document.querySelector('.portal-report-controls input[type="search"]');
    const legacyFilters=[];
    (config.legacyFilters||[]).forEach((definition,index)=>{
      const select=document.querySelectorAll('.portal-report-controls select')[index];
      if(!select)return;
      const [label,key,choices]=definition;select.replaceChildren();const first=document.createElement('option');first.value='';first.textContent=`All ${label.toLowerCase()}s`;select.append(first);
      choices.forEach(value=>{const option=document.createElement('option');option.value=value;option.textContent=value;select.append(option);});
      select.disabled=false;legacyFilters.push([select,key]);
    });
    const tableSearch=()=>searchLegacy?.value || search.value;
    function render(){
      const list=Array.isArray(store[config.collection])?store[config.collection]:[];
      const query=tableSearch().trim().toLowerCase();const selected=filter.value;
      const filtered=list.filter(record=>{
        const text=config.fields.map(([key])=>record[key]||'').join(' ').toLowerCase();
        const matchesSearch=!query||text.includes(query);
        const matchesMain=!selected||String(record[config.filter]||'')===selected;
        const matchesLegacy=legacyFilters.every(([el,key])=>!el.value||String(record[key]||'').toLowerCase()===el.value.toLowerCase());
        let matchesPeriod=true;
        if(page==='admin-scheduling'&&record.date){
          const date=new Date(`${record.date}T00:00:00`),today=new Date();
          const view=section.dataset.calendarView||'Monthly';
          if(view==='Daily')matchesPeriod=date.toDateString()===today.toDateString();
          else if(view==='Weekly'){const start=new Date(today);start.setDate(today.getDate()-((today.getDay()+6)%7));start.setHours(0,0,0,0);const end=new Date(start);end.setDate(start.getDate()+7);matchesPeriod=date>=start&&date<end;}
          else matchesPeriod=date.getFullYear()===today.getFullYear()&&date.getMonth()===today.getMonth();
        }
        return matchesSearch&&matchesMain&&matchesLegacy&&matchesPeriod;
      });
      rows.innerHTML=filtered.length?filtered.map(record=>`<tr>${config.fields.map(([key])=>`<td>${escapeHtml(record[key])}</td>`).join('')}<td class="portal-row-actions"><button type="button" data-edit="${escapeHtml(record.id)}">Edit</button><button type="button" data-remove="${escapeHtml(record.id)}">Remove</button></td></tr>`).join(''):`<tr><td class="portal-empty-row" colspan="${config.fields.length+1}">No entries match your search. Add a record or adjust the filters.</td></tr>`;
      status.textContent=`${filtered.length} ${filtered.length===1?'entry':'entries'} shown.`;
      const hours=section.querySelector('[data-hours-summary]');if(hours){const total=list.reduce((sum,entry)=>sum+(Number(entry.hours)||0),0);hours.textContent=`Personal hours recorded: ${total}. This log is not instructor-verified.`;}
      const countTarget=document.querySelector(`[data-local-count="${config.collection}"]`);if(countTarget)countTarget.textContent=String(list.length);
    }
    form.addEventListener('submit',event=>{
      event.preventDefault();if(!form.reportValidity())return;
      const data=Object.fromEntries(new FormData(form).entries());const id=data.id||makeId();delete data.id;
      const list=Array.isArray(store[config.collection])?store[config.collection]:[];const index=list.findIndex(entry=>entry.id===id);
      const record={id,...data,updatedAt:new Date().toISOString()};if(index<0)list.unshift(record);else list[index]=record;store[config.collection]=list;
      if(saveStore()){form.reset();form.elements.id.value='';form.querySelector('[type="submit"]').textContent='Add entry';section.querySelector('[data-cancel-edit]').hidden=true;status.textContent='Entry saved.';}else status.textContent='Entry could not be saved. Please try again.';
      render();
    });
    section.querySelector('[data-cancel-edit]').addEventListener('click',()=>{form.reset();form.elements.id.value='';form.querySelector('[type="submit"]').textContent='Add entry';section.querySelector('[data-cancel-edit]').hidden=true;});
    rows.addEventListener('click',event=>{
      const edit=event.target.closest('[data-edit]'),remove=event.target.closest('[data-remove]');if(!edit&&!remove)return;
      const list=store[config.collection]||[];const record=list.find(entry=>entry.id===(edit||remove).dataset[edit?'edit':'remove']);if(!record)return;
      if(edit){for(const [key] of config.fields)if(form.elements[key])form.elements[key].value=record[key]||'';form.elements.id.value=record.id;form.querySelector('[type="submit"]').textContent='Save changes';section.querySelector('[data-cancel-edit]').hidden=false;form.scrollIntoView({behavior:scrollBehavior,block:'center'});}
      else{store[config.collection]=list.filter(entry=>entry.id!==record.id);saveStore();render();}
    });
    search.addEventListener('input',render);searchLegacy?.addEventListener('input',render);filter.addEventListener('change',render);legacyFilters.forEach(([el])=>el.addEventListener('change',render));
    section.querySelector('[data-export]').addEventListener('click',()=>exportCsv(config.fields.map(f=>f[1]),(store[config.collection]||[]).map(record=>config.fields.map(([key])=>record[key]||'')),`${config.collection}.csv`));
    document.querySelectorAll('.portal-report-controls input:not([type="search"]),.portal-report-controls select').forEach(el=>el.disabled=false);
    const legacyNote=document.querySelector('.portal-report-controls')?.parentElement?.querySelector('.portal-inline-note');
    if(legacyNote&&/filters require|filters update/i.test(legacyNote.textContent))legacyNote.textContent='Search and filters update the entries shown below.';
    render();
  }

  function exportCsv(headers, records, filename){
    const cell=value=>`"${String(value??'').replace(/"/g,'""')}"`;
    const csv=[headers,...records].map(row=>row.map(cell).join(',')).join('\r\n');
    const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download=filename;link.click();URL.revokeObjectURL(url);
  }

  function attachReports(){
    const main=document.querySelector('.portal-main'),welcome=main?.querySelector('.portal-welcome');if(!main||!welcome)return;
    const old=main.querySelector('.portal-report-controls')?.closest('.portal-panel');if(old)old.hidden=true;
    const section=document.createElement('section');section.className='portal-panel portal-workspace portal-section';section.id='workspace';
    section.innerHTML=`<div class="portal-section-heading"><div><h2>Report builder</h2><p>Filter workspace entries by source and date, then export the visible rows.</p></div><button class="portal-secondary-link" type="button" data-report-export>Export CSV</button></div><div class="portal-workspace-tools"><label class="portal-field">Report type<select data-report-source>${reportSources.map(([key,label])=>`<option value="${key}">${label}</option>`).join('')}</select></label><label class="portal-field">From<input type="date" data-from></label><label class="portal-field">To<input type="date" data-to></label></div><p class="portal-inline-note" data-report-status aria-live="polite"></p><div class="portal-table-wrap"><table class="portal-table"><thead data-report-head></thead><tbody data-report-rows></tbody></table></div>`;
    welcome.insertAdjacentElement('afterend',section);
    const source=section.querySelector('[data-report-source]'),from=section.querySelector('[data-from]'),to=section.querySelector('[data-to]'),thead=section.querySelector('[data-report-head]'),tbody=section.querySelector('[data-report-rows]'),status=section.querySelector('[data-report-status]');let current=[];
    const render=()=>{const key=source.value;current=Array.isArray(store[key])?store[key]:[];const filtered=current.filter(item=>{const date=String(item.date||item.updatedAt||'').slice(0,10);return(!from.value||date>=from.value)&&(!to.value||date<=to.value)});const headers=filtered.length?Object.keys(filtered[0]).filter(x=>x!=='id'&&x!=='updatedAt'):['Entries'];thead.innerHTML=`<tr>${headers.map(h=>`<th scope="col">${escapeHtml(h)}</th>`).join('')}</tr>`;tbody.innerHTML=filtered.length?filtered.map(item=>`<tr>${headers.map(h=>`<td>${escapeHtml(item[h])}</td>`).join('')}</tr>`).join(''):`<tr><td class="portal-empty-row">No entries match this report yet.</td></tr>`;status.textContent=`${filtered.length} entries available in the selected date range.`;current=filtered};
    [source,from,to].forEach(control=>control.addEventListener('change',render));section.querySelector('[data-report-export]').addEventListener('click',()=>{const headers=current.length?Object.keys(current[0]).filter(x=>x!=='id'&&x!=='updatedAt'):['Entries'];exportCsv(headers,current.map(item=>headers.map(key=>item[key]||'')),`${source.value}-report.csv`)});render();
  }

  function attachSettings(){
    const form=document.querySelector('.portal-form');if(!form)return;
    form.dataset.localSettings='true';const role=body.dataset.portalRole;const key=`drivepro-${role}-settings`;
    try{const saved=JSON.parse(localStorage.getItem(key)||'{}');form.querySelectorAll('input,select,textarea').forEach((field,index)=>{field.name=field.name||field.getAttribute('aria-label')||`setting-${index}`;if(saved[field.name]!==undefined)field.value=saved[field.name];});}catch{}
    const save=form.querySelector('button[disabled]');if(save){save.disabled=false;save.type='submit';}
    form.addEventListener('submit',event=>{event.preventDefault();const values=Object.fromEntries(new FormData(form).entries());try{localStorage.setItem(key,JSON.stringify(values));if(role==='admin'){const appearance=Object.entries(values).find(([name])=>/appearance/i.test(name))?.[1];const direction=Object.entries(values).find(([name])=>/direction/i.test(name))?.[1];if(appearance&&/^(light|dark)$/i.test(appearance)){const desired=appearance.toLowerCase()==='dark';if(document.body.classList.contains('dark-mode')!==desired)document.getElementById('themeToggle')?.click();}if(direction&&/left to right|right to left/i.test(direction)){const desired=direction.toLowerCase()==='right to left';if((document.documentElement.dir==='rtl')!==desired)document.getElementById('directionToggle')?.click();}}const note=form.querySelector('.portal-inline-note');if(note)note.textContent='Settings updated.';}catch{const note=form.querySelector('.portal-inline-note');if(note)note.textContent='Settings could not be saved. Please try again.';}});
  }

  const page=body.dataset.page;
  if(page==='admin-reports')attachReports();else if(page.endsWith('-settings'))attachSettings();else if(configs[page])attachWorkspace(configs[page]);

  const overviewLinks=page==='admin-dashboard'
    ? [['admin-students.html','admin-students'],['admin-instructors.html','admin-instructors'],['admin-courses.html','admin-courses'],['admin-scheduling.html','admin-scheduling'],['admin-vehicles.html','admin-vehicles'],['admin-fees.html','admin-fees']]
    : page==='student-dashboard'
      ? [['student-courses.html','student-courses'],['student-lessons.html','student-lessons'],['student-progress.html','student-progress'],['student-fees.html','student-fees']]
      : [];
  overviewLinks.forEach(([href,key])=>{
    const count=(Array.isArray(store[key])?store[key]:[]).length;
    const card=document.querySelector(`.portal-summary-card a[href="${href}"]`)?.closest('.portal-summary-card');
    const metric=document.querySelectorAll('.portal-kpi .portal-kpi-value')[page==='student-dashboard'?['student-courses','student-lessons','student-progress','student-fees'].indexOf(key):-1];
    if(metric)metric.textContent=count?`${count} saved ${count===1?'entry':'entries'}`:'No entries yet';
    const note=card?.querySelector('.portal-kpi-note');if(note)note.textContent=count?`${count} entries in this workspace.`:'No entries yet.';
  });

  if(page==='admin-scheduling'){
    const buttons=[...document.querySelectorAll('.portal-report-controls button')];
    buttons.filter(button=>['Daily','Weekly','Monthly'].includes(button.textContent.trim())).forEach(button=>{button.disabled=false;button.setAttribute('aria-pressed',String(button.textContent.trim()==='Monthly'));button.addEventListener('click',()=>{buttons.forEach(other=>other.setAttribute('aria-pressed',String(other===button)));document.querySelector('.portal-workspace').dataset.calendarView=button.textContent.trim();let note=document.querySelector('.portal-report-controls [data-view-note]');if(!note){note=document.createElement('span');note.dataset.viewNote='';document.querySelector('.portal-report-controls')?.append(note);}if(note)note.textContent=`${button.textContent.trim()} view selected.`;document.querySelector('.portal-workspace [data-search]')?.dispatchEvent(new Event('input'));});});
    const actions=buttons.find(button=>button.textContent.toLowerCase().includes('schedule lesson'));if(actions){actions.disabled=false;actions.addEventListener('click',()=>document.getElementById('workspace')?.scrollIntoView({behavior:scrollBehavior}));}
  }
  document.querySelectorAll('.portal-disabled-action').forEach(button=>{button.disabled=false;if(page==='admin-fees'&&/unavailable/i.test(button.textContent))button.textContent='Add refund request';if(page==='admin-courses'&&/unavailable/i.test(button.textContent))button.textContent='Manage course settings';button.addEventListener('click',()=>{const destination=page==='admin-instructors'?'admin-scheduling.html#workspace':page==='admin-vehicles'?'admin-scheduling.html#workspace':page==='admin-fees'?'admin-fees.html#workspace':'#workspace';if(destination.startsWith('#'))document.querySelector(destination)?.scrollIntoView({behavior:scrollBehavior,block:'center'});else location.href=destination;});});
  document.querySelectorAll('.portal-report-controls button:disabled').forEach(button=>button.disabled=false);
  document.querySelectorAll('.portal-report-controls input:disabled,.portal-report-controls select:disabled').forEach(control=>control.disabled=false);
  const addCourse=document.querySelector('.portal-report-controls button');if(page==='admin-courses'&&addCourse)addCourse.addEventListener('click',()=>document.getElementById('workspace')?.scrollIntoView({behavior:scrollBehavior,block:'center'}));
  document.querySelectorAll('.portal-report-controls [type="search"]').forEach(input=>{input.removeAttribute('disabled');});
})();
