# Sakura KGL — Premium Website Redesign

This folder is the redesigned Sakura KGL website, based on the supplied redesign brief and the existing Sakura KGL pages.

## Included
- `index.html` — redesigned homepage
- `logistics.html` — freight logistics page
- `counseling.html` — business advisory page
- `about.html` — company story, values and video
- `contact.html` — contact + meeting request forms
- `style.css` — complete visual system and responsive layout
- `script.js` — navigation, scroll reveals, counters, date handling and form submission
- `send.php` — PHP form handler for PHP-capable hosting
- `assets/bg-freight.mp4` — supplied freight video
- `assets/bg-freight-poster.jpg` — supplied video poster
- `assets/sakura-mark-light.png` — cleaned logo mark for dark navigation/footer
- `assets/sakura-logo.png` / `sakura-logo-light.png` — logo assets
- `.hintrc` — retained project hint configuration

## Design direction implemented
The redesign follows the supplied brief: cinematic freight hero, burgundy/wine + warm off-white + charcoal + muted gold palette, floating navigation, animated metrics, interactive two-pillar section, Kigali-to-global route visual, premium trust section, process timeline, service cards, Insights area, strong conversion CTA, improved About page, responsive mobile navigation and subtle micro-interactions.

## Important content note
No client testimonials or client logos were invented. The redesign leaves room for those elements to be added once Sakura KGL has permission and approved material.

The boardroom image currently uses a remote Unsplash image because no separate advisory photograph was supplied. For a fully local/offline site, replace that URL in `index.html` with an approved Sakura KGL image in `assets/`.

## Hosting
### PHP/cPanel hosting
Upload the whole folder, including `assets/`, to the public web directory. The contact and meeting forms post to `send.php`.

### GitHub Pages
GitHub Pages hosts static HTML/CSS/JS but does not execute PHP. The visual website will work, but `send.php` will not process forms there. Use a PHP-capable host or replace the form endpoint with a form service such as the one already used by your project if applicable.

## Before publishing
1. Replace the supplied freight clip with original Sakura KGL footage when available.
2. Add an approved Managing Director/founder photograph if desired.
3. Replace the remote advisory image with an approved local image.
4. Confirm the phone numbers, email addresses, address and legal wording.
5. Confirm that “Licensed & Insured” and any network/reach statements remain accurate for the live company.
6. Test both forms on the actual PHP host.

## Visual upgrade — green edition

This version uses the green from the supplied Sakura logo as the primary brand color, with the logo's muted gold as the accent. The homepage and internal page heroes now use crossfading cinematic video backgrounds. The video rotation combines the supplied Sakura freight footage with selected Pexels logistics and business-advisory footage. See `MEDIA-SOURCES.md` for the source pages.

Stock footage is presented as atmospheric background material and is not represented as Sakura KGL's own operations.
