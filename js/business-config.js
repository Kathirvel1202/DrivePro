/**
 * DrivePro Driving School — Central Business, Location & Licensing Configuration
 * 
 * =========================================================================================
 * NOTICE: PENDING OWNER CONFIRMATION
 * =========================================================================================
 * The website previously contained conflicting regulatory references across multiple
 * jurisdictions (e.g. UK DVSA vs. US State DMV) and sample addresses.
 * 
 * Based on the consistent dollar ($) pricing, (800) toll-free phone formatting, and
 * Class D / Class M driver licensing terminology, the site standardizes on the
 * State Department of Transportation & Department of Motor Vehicles (DMV) framework.
 * 
 * The business owner must review and confirm the physical operating address, local
 * state/provincial regulatory accreditation ID, and verified telephone numbers below.
 * =========================================================================================
 */

const DRIVEPRO_CONFIG = {
  // Business Identity
  business: {
    legalName: "DrivePro Driving School & License Training Center",
    brandName: "DrivePro",
    tagline: "Driving School & License Training Center",
    establishedYear: 2014,
    status: "Active · Accredited Driver Training Institution"
  },

  // Licensing Authority & Regulatory Context (Adopted: State DMV Framework)
  licensing: {
    governingAuthority: "State Department of Transportation & Department of Motor Vehicles (DMV)",
    accreditationTitle: "State Licensed & DMV Approved Driver Education Facility",
    accreditationCode: "DS-994208-A", // [CONFIRMATION REQUIRED]: Owner to supply official state school license #
    instructorCredential: "State Certified Commercial Driving Instructor",
    curriculumStandard: "Official State DMV Driver Education & Practical Test Standards",
    supportedLicenseClasses: [
      { code: "Class D", category: "Passenger Vehicle (Manual & Automatic)", minAge: 16 },
      { code: "Class M", category: "Motorcycle & Motor Scooter", minAge: 16 },
      { code: "Commercial C1", category: "Light Commercial Delivery Vehicle", minAge: 18 }
    ]
  },

  // Currency & Financial Defaults
  currency: {
    symbol: "$",
    code: "USD",
    name: "US Dollar",
    displayFormat: "symbol-first" // e.g. $750
  },

  // Physical Location & Service Area
  location: {
    isOwnerConfirmed: false, // Set to true once verified by school owner
    confirmationNotice: "[OWNER CONFIRMATION REQUIRED]: Replace sample campus address with verified physical facility address prior to commercial operation.",
    mainCampus: {
      facilityName: "DrivePro Academy Central Campus",
      streetAddress: "100 Driver Way, Suite 400",
      city: "Metro City",
      stateRegion: "Central Licensing District",
      postalCode: "10001", // [CONFIRMATION REQUIRED]
      country: "United States"
    },
    trainingGrounds: {
      facilityName: "DrivePro Closed Manoeuvre & Motorcycle Pad",
      streetAddress: "420 Motorway Blvd, Suite 100",
      city: "Metro City",
      stateRegion: "Central Licensing District"
    },
    serviceAreaRadius: "Free door-to-door learner pickup within a 25-mile radius of Central Campus"
  },

  // Official Business Contacts
  contact: {
    isOwnerConfirmed: false,
    confirmationNotice: "[OWNER CONFIRMATION REQUIRED]: Replace sample (800) number and email with verified commercial lines.",
    phone: "(800) 555-0199",
    phoneHref: "tel:+18005550199",
    smsDirect: "+1 (800) 555-0198",
    emailAdmissions: "admissions@driveproacademy.com",
    emailSupport: "support@driveproacademy.com",
    operatingHours: "Monday – Saturday: 7:00 AM – 8:00 PM | Sunday: 8:00 AM – 5:00 PM"
  },

  // Booking & API Integration Architecture
  integration: {
    // Current integration: "frontend-fallback" (client-only mode) or "api-endpoint"
    mode: "frontend-fallback",
    // Configure HTTPS endpoint (e.g., https://api.driveproacademy.com/v1/bookings or CRM webhook)
    // When null, frontend fallback mode is active.
    apiEndpoint: null,
    // [SECURITY RULE]: Never store API keys, private tokens, or database secrets in client-side config.
    storageKey: "drivepro-pending-bookings",
    fallbackNotice: "Frontend Fallback Mode: Submissions are validated client-side, queued in local browser session storage, and prepared for dispatch to admissions."
  }
};

// Expose globally for browser script tags and CommonJS for automated test suites
if (typeof window !== "undefined") {
  window.DRIVEPRO_CONFIG = DRIVEPRO_CONFIG;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = DRIVEPRO_CONFIG;
}

