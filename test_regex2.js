const color = '#FFFFFF';
let code = `<svg><rect fill="none" /><path fill="#000" stroke='transparent' /><circle fill='red' /></svg>`;
let processed = code.replace(/fill=["'](?!none|transparent)([^"']*)["']/ig, `fill="${color}"`)
                    .replace(/stroke=["'](?!none|transparent)([^"']*)["']/ig, `stroke="${color}"`);
console.log(processed);
