const fs = require('fs');
let content = fs.readFileSync('src/components/matrix/MatrixExportModal.tsx', 'utf8');

content = content.replace(
  /const pngUrl = canvas\.toDataURL\('image\/png'\);\n\s*downloadFile\(pngUrl, `Matrix_Logo_Retina_\$\{Date\.now\(\)\}\.png`, 'image\/png'\);/,
  `canvas.toBlob((blob) => {
          if (blob) {
            downloadFile(blob, \`Matrix_Logo_Retina_\${Date.now()}.png\`, 'image/png');
            showNotification(forBlueprint ? 'Blueprint PNG descargado' : 'PNG Retina descargado', 'success');
          }
        }, 'image/png');`
);

content = content.replace(
  /showNotification\(forBlueprint \? 'Blueprint PNG descargado' : 'PNG Retina descargado', 'success'\);\n\s*\}\n\s*DOMURL\.revokeObjectURL\(url\);/,
  `}\n      DOMURL.revokeObjectURL(url);`
);

fs.writeFileSync('src/components/matrix/MatrixExportModal.tsx', content);
