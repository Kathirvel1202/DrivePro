# SEO and asset release notes

- Public marketing pages have distinct page titles and descriptions, plus Open Graph title, description, locale, and type metadata.
- Admin, student, instructor dashboard, sign-in, and registration pages use `noindex, nofollow` because they are portal or account pages.
- Existing HTML routes and local image paths were preserved. Raster images now include intrinsic dimensions to reserve layout space. Large JPEGs were resized to a maximum 1600-pixel edge and recompressed at quality 78; the updated images save about 2.9 MB across the two image directories.
- Local favicon and stylesheet, script, image, and CSS URL references resolve in the repository. SVG favicon references specify `image/svg+xml`.
- Canonical URLs and absolute Open Graph image/URL values are not set: the project does not establish a verified public origin. Add them after confirming the production domain.
- Local-business structured data is not added. `js/business-config.js` marks the address and contact details as unconfirmed and also contains sample licensing credentials; confirm those details with the owner before publishing business schema or claims based on them.
- The sample contact details and map were removed; unsupported homepage metrics and testimonials were removed from source; instructor and policy claims were replaced by confirmation notices. Pricing and course pages identify their details as draft examples. Login, registration, and portal pages state that secure account services are unavailable. Booking submissions without an API endpoint are not stored or sent.
- The booking API is optional and currently unset. Before production, configure an HTTPS endpoint in `DRIVEPRO_CONFIG.integration.apiEndpoint`, implement server-side validation and storage, configure CORS and real confirmation behavior, and add secure server-side authentication for account/portal features. No API keys belong in this client-side configuration.
- WebP/AVIF variants were not generated because no supported image conversion tool is installed in this environment. JPEG paths remain compatible with the current pages.
- No performance or search ranking score is claimed. This is a source-level audit; it does not measure production response headers, browser network failures, Core Web Vitals, or indexing.
