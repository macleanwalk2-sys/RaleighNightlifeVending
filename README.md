# Raleigh Nightlife Vending

Landing page for a vape vending machine business placing age-verified machines in
21+ venues on Glenwood South in Raleigh, NC. Built for one audience: a bar owner
deciding whether we're worth a meeting.

An **Oakwood Marketing** site — same bones as
[Oakwood Marketing Services](https://github.com/macleanwalk2-sys/CodeProject),
in its own colour.

`Raleigh Nightlife Vending` is a placeholder name. See [NAMES.md](NAMES.md).

## Pages
- `index.html` — single landing page: hero, `#how`, `#compliance`, `#machine`,
  `#faq`, `#contact`

## Structure
```
index.html
css/styles.css       all styling
js/main.js           scroll reveal, mobile nav, contact form
assets/logo.svg      the cabinet mark, standalone teal version
assets/favicon.svg   browser tab icon, white cabinet on a teal tile
assets/scene.svg     the machine and two buildings, beside the headline
```

No build step and no dependencies. Everything is hand written HTML, CSS, and a
little vanilla JS.

## Design

Deliberately the same system as the Oakwood Marketing site, so the two read as
one shop's work:

- **Type:** Sora for headings, Inter for body (loaded from Google Fonts)
- **Layout:** three container widths (680px read column, 1080px standard, full
  bleed for the dark bands), 10px radius, card grid with a hover lift, dark
  header, hero and footer
- **Motion:** sections fade in on scroll, primary buttons carry a soft lift, nav
  links sweep an underline. All motion is disabled for visitors who prefer
  reduced motion.

**Colours:** deep marine teal (`#1d6e78`) where Oakwood uses green, defined as
CSS variables at the top of `styles.css`. Change them there and they change
everywhere — that one swap is what makes a new Oakwood site.

The teal is cool on purpose. A warm lamp tone (`--lamp`, `#d9a24e`) is then the
only warmth anywhere on the page, so the lit machine in the hero reads as the
single source of light in a dark room. Everything else — grounds, rules, muted
text — is tinted toward the teal rather than left neutral grey.

The teal passes contrast with white text (6.0:1) so it can carry buttons and the
dark bands, the same job green does on Oakwood.

## Run it
Open `index.html` directly, or serve the folder:
```
python3 -m http.server 8000
```
Then visit http://localhost:8000

## Deploying
GitHub Pages: repo → **Settings** → **Pages** → Source **Deploy from a branch**,
branch `main`, folder `/ (root)`. Live at
`https://macleanwalk2-sys.github.io/RaleighNightlifeVending/` within a minute or
two of a push.

The stylesheet link carries a `?v=` number. Bump it in `index.html` whenever
`styles.css` changes, so browsers pick up the new file instead of a cached copy.

> This repository is **public**, so anything committed here is visible to anyone
> who finds it. Worth flipping to private (Settings → General → Danger Zone)
> while the placeholders below are still in place.

## Still to do

Search the project for `PASTE_YOUR`, `[Name]`, and `555` to find most of these.

- **Business name.** Pick one from [NAMES.md](NAMES.md) and find-and-replace it
  across `index.html` (header, footer, `<title>`, meta description) and the
  email address.
- **Machine photo.** Add it as `assets/machine.jpg`.
- **Order the ID scanner.** On the VTM Mini Wall the ID scanner is an *optional*
  module, not standard equipment. The compliance section states that the machine
  will not dispense until an ID is scanned, and the whole sales argument rests on
  that sentence. Confirm the scanner is on the purchase order, or the claim has
  to come off the page.
- **Contact form** needs an endpoint. Create a free form at
  [Formspree](https://formspree.io) and paste the URL into `data-endpoint` on the
  `<form>` in `index.html`, replacing `PASTE_YOUR_FORMSPREE_ENDPOINT_HERE`. Until
  then the form stays in demo mode and points visitors at the email address
  instead of silently discarding messages.
- **Contact details** are placeholders: `hello@raleighnightlifevending.com` and
  the phone number.
- **Social preview image** for when the link gets texted around — add
  `assets/og-preview.jpg` at 1200×630 and reference it with an `og:image` tag.
- **Custom domain** (roughly $12/yr) whenever you want to move off the
  github.io address.

### Verify the compliance claims before this goes in front of anyone

The `#compliance` section is the most important part of this page for a bar
owner, and it currently states things as fact that need to be true before launch:

- ID verification at the machine — the Mini Wall's ID scanner is an optional
  module, so this is only true if you order it
- Licensed distributor sourcing — have the paperwork ready to show
- General liability coverage, with the venue named on the certificate — get the
  policy first
- Whatever NC and FDA rules apply to tobacco vending and to placement in
  age-restricted venues — worth an hour with an NC business attorney before you
  pitch anyone, since the whole sales argument rests on this section

There is also no social proof anywhere on this page on purpose. No testimonials,
no client logos, no "trusted by 200+ venues." A bar owner who catches one fake
claim is gone, and with no machines placed yet the honest play is to sell the
process instead. Add real proof here as soon as you have the first venue.
