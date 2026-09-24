// Patches the static `expo export -p web` output so it works when hosted
// under a subpath (e.g. GitHub Pages project sites at /<repo-name>/), and
// adds the PWA tags Expo's bare (non-router) web export doesn't generate,
// so "Add to Home Screen" on iOS/Android gets a real icon and standalone mode.
const fs = require("fs");
const path = require("path");

const indexPath = path.join(__dirname, "..", "dist", "index.html");
let html = fs.readFileSync(indexPath, "utf8");

// Make the asset/script references relative instead of root-absolute, so the
// page works regardless of the subpath it's served from.
html = html.replace('href="/favicon.ico"', 'href="favicon.ico"');
html = html.replace('src="/_expo/', 'src="_expo/');

const pwaTags = [
  '<link rel="manifest" href="manifest.json">',
  '<link rel="apple-touch-icon" href="apple-touch-icon.png">',
  '<meta name="apple-mobile-web-app-capable" content="yes">',
  '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">',
  '<meta name="apple-mobile-web-app-title" content="Strength Tracker">',
].join("\n  ");

html = html.replace("</head>", `  ${pwaTags}\n</head>`);

fs.writeFileSync(indexPath, html);
console.log("Patched dist/index.html for subpath hosting + PWA tags.");
