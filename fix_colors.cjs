const fs = require('fs');

const path = 'src/data/canonicalLogos.ts';
let content = fs.readFileSync(path, 'utf8');

const blocks = [
  { name: 'HMA TYPE', rules: [['#AE7176', '#AE7176'], ['#7A4F53', '#77454A']] },
  { name: 'HMA VISUALS', rules: [['#D96B43', '#D96B43'], ['#994B2E', '#964222']] },
  { name: 'HMA PRINT', rules: [['#C99700', '#D7BB11'], ['#8C6900', '#8C7907']] },
  { name: 'HMA SOFTWARE', rules: [['#2280AC', '#11D7B6'], ['#165A7A', '#0A8570']] },
  { name: 'HMA WATERMARK', rules: [['#75C962', '#75C962'], ['#518C44', '#4B893C']] },
  { name: 'HMA TRANSCENDENCE', rules: [['#315629', '#315629'], ['#213B1C', '#1B3315']] },
  { name: 'HMA PUBLISHING', rules: [['#D7BB11', '#C5A367'], ['#96830C', '#82600A']] },
  { name: 'HMA TEMPLES', rules: [['#7077B0', '#7D77B0'], ['#4E537B', '#514B7D']] },
  { name: 'HMA CINEMA', rules: [['#2D60C1', '#1D5B8F'], ['#1E4387', '#1B3F67']] },
  { name: 'HMA MUSIC', rules: [['#16A097', '#0E8490'], ['#0F736C', '#074349']] },
  { name: 'HMA PHOTOGRAPHY', rules: [['#11D7B6', '#052D63'], ['#0C9982', '#031C3D']] },
];

let currentIndex = 0;
while (true) {
  let nextServiceIndex = content.indexOf('serviceName:', currentIndex);
  if (nextServiceIndex === -1) break;
  
  let endIndex = content.indexOf('serviceName:', nextServiceIndex + 1);
  if (endIndex === -1) endIndex = content.length;
  
  let block = content.substring(nextServiceIndex, endIndex);
  
  for (const b of blocks) {
    if (block.includes(b.name)) {
      for (const rule of b.rules) {
        block = block.split(rule[0]).join(rule[1]);
      }
    }
  }
  
  content = content.substring(0, nextServiceIndex) + block + content.substring(endIndex);
  currentIndex = nextServiceIndex + block.length;
}

fs.writeFileSync(path, content);
