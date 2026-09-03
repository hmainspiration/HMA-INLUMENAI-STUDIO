const fs = require('fs');

const path = 'src/data/canonicalLogos.ts';
let content = fs.readFileSync(path, 'utf8');

const colorsMap = {
  'HMA TYPE': { luz: '#AE7176', pro: '#77454A' },
  'HMA VISUALS': { luz: '#D96B43', pro: '#964222' },
  'HMA PRINT': { luz: '#D7BB11', pro: '#8C7907' },
  'HMA SOFTWARE': { luz: '#11D7B6', pro: '#0A8570' },
  'HMA WATERMARK': { luz: '#75C962', pro: '#4B893C' },
  'HMA TRANSCENDENCE': { luz: '#315629', pro: '#1B3315' },
  'HMA PUBLISHING': { luz: '#C5A367', pro: '#82600A' },
  'HMA TEMPLES': { luz: '#7D77B0', pro: '#514B7D' },
  'HMA CINEMA': { luz: '#1D5B8F', pro: '#1B3F67' },
  'HMA MUSIC': { luz: '#0E8490', pro: '#074349' },
  'HMA PHOTOGRAPHY': { luz: '#052D63', pro: '#031C3D' },
  'HMA DESIGN': { luz: '#3D80FD', pro: '#2D60C1' },
  'HMA INLUMENAI': { luz: '#3D80FD', pro: '#2D60C1' },
};

for (const [name, colors] of Object.entries(colorsMap)) {
  const searchStr = `serviceName: "${name}",`;
  // Check if it already has luzColor
  const index = content.indexOf(searchStr);
  if (index !== -1) {
    // Find the next line
    const clusterIndex = content.indexOf('clusterName:', index);
    if (clusterIndex !== -1) {
      const endOfClusterLine = content.indexOf('\n', clusterIndex);
      
      // Check if luzColor is already there
      const hasLuz = content.substring(endOfClusterLine, endOfClusterLine + 50).includes('luzColor');
      
      if (!hasLuz) {
         content = content.substring(0, endOfClusterLine) + 
                   `\n    luzColor: "${colors.luz}",\n    profundoColor: "${colors.pro}",` + 
                   content.substring(endOfClusterLine);
      } else {
         // Replace if it's there but wrong
         let blockEnd = content.indexOf('shapes:', index);
         let block = content.substring(index, blockEnd);
         block = block.replace(/luzColor: ".*"/, `luzColor: "${colors.luz}"`);
         block = block.replace(/profundoColor: ".*"/, `profundoColor: "${colors.pro}"`);
         content = content.substring(0, index) + block + content.substring(blockEnd);
      }
    }
  }
}

fs.writeFileSync(path, content);
