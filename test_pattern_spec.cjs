const pattern = `<pattern id="p1" width="100" height="100" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
  <rect width="100" height="100" fill="none" stroke="red"/>
</pattern>`;
console.log("Valid SVG pattern attribute check:", pattern.includes('patternTransform="rotate(45)"'));
