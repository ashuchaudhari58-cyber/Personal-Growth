# Personal-Growth

My portfolio site: design and analysis work on HDD, microtunnelling, Direct Pipe and structural/FEA.

Live: https://ashuchaudhari58-cyber.github.io/Personal-Growth/

It's plain HTML, CSS and JavaScript, so there is no build step and nothing to install. GitHub Pages
serves it straight from `main`.

## Layout

- `index.html` – page structure
- `css/styles.css` – all styling, including the dark theme
- `js/data.js` – the content: about text, case studies, tools, codes, experience
- `js/main.js` – renders the content and handles the menu, filters and project pop-ups
- `js/hero-flow.js` – the drawings at the top of the page
- `assets/` – CV, photo, favicon and link-preview image

## Updating

Almost every change is made in `js/data.js`. To add a project, copy an existing entry in `PROJECTS`
and edit it. `cat` decides which filter it shows under (`hdd`, `mt`, `dp`, `struct` or `rnd`).

To replace the CV, overwrite `assets/Ashutosh_Chaudhari_CV.pdf` and keep the same file name.

Clients are named by owner only. No project numbers, contractor names, document numbers or contract
values go on the site.

To check changes locally, open `index.html` in a browser.

## Note

The site is set to `noindex`, so search engines don't list it. It's meant to be opened from the link
in my CV.
