const fs = require('fs');

// Test how SVG pattern behaves with an inner SVG
const patternW = 250;
const patternH = 250;
const innerSvg = `<svg viewBox="0 0 200 600" width="100%" height="100%" preserveAspectRatio="xMidYMid meet"><rect width="200" height="600" fill="red"/><text x="20" y="100" font-size="50">INLUMENAI</text></svg>`;

const result = `
<svg width="1000" height="1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="pat1" width="${patternW}" height="${patternH}" patternUnits="userSpaceOnUse">
      ${innerSvg}
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#pat1)"/>
</svg>
`;
console.log("Result length:", result.length);
