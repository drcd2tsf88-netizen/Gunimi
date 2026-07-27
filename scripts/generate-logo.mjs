import sharp from "sharp";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none" width="120" height="120">
  <rect width="120" height="120" rx="26" fill="#05060A"/>

  <!-- Ambient glow -->
  <radialGradient id="bg" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#6D5BFF" stop-opacity="0.18"/>
    <stop offset="100%" stop-color="#6D5BFF" stop-opacity="0"/>
  </radialGradient>
  <circle cx="60" cy="60" r="54" fill="url(#bg)"/>

  <!-- Outer ring -->
  <circle cx="60" cy="60" r="50" stroke="#6D5BFF" stroke-width="1.2" stroke-dasharray="7 5" stroke-opacity="0.3"/>

  <!-- Mid ring -->
  <circle cx="60" cy="60" r="37" stroke="#8B7DFF" stroke-width="1.4" stroke-opacity="0.5"/>

  <!-- Inner ring -->
  <circle cx="60" cy="60" r="24" stroke="#A998FF" stroke-width="1.8" stroke-opacity="0.72"/>

  <!-- Core glow -->
  <radialGradient id="core-glow" cx="42%" cy="38%" r="58%">
    <stop offset="0%" stop-color="#C4B8FF"/>
    <stop offset="100%" stop-color="#6D5BFF"/>
  </radialGradient>
  <circle cx="60" cy="60" r="11" fill="url(#core-glow)"/>
  <circle cx="60" cy="60" r="5.5" fill="#D4CCFF" fill-opacity="0.95"/>

  <!-- Orbit dot — top -->
  <circle cx="60" cy="10" r="3.8" fill="#8B7DFF" fill-opacity="0.82"/>

  <!-- Orbit dot — right -->
  <circle cx="110" cy="60" r="3" fill="#6D5BFF" fill-opacity="0.6"/>

  <!-- Orbit dot — bottom-left -->
  <circle cx="20" cy="97" r="2.5" fill="#6D5BFF" fill-opacity="0.42"/>
</svg>`;

const buffer = Buffer.from(svg);

const output = "gunimi-logo-120.png";

sharp(buffer).resize(120, 120).png({ compressionLevel: 9 }).toFile(output, (err, info) => {
  if (err) {
    process.stderr.write("Error: " + err.message + "\n");
    process.exit(1);
  }
  process.stdout.write(`✓ ${output} created (${info.size} bytes)\n`);
});
