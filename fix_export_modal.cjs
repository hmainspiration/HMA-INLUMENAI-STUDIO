const fs = require('fs');
let content = fs.readFileSync('src/components/matrix/MatrixExportModal.tsx', 'utf8');

// I'll just write a new handleExportPng method inside the component and insert it before handleCopyCode
const newMethod = `
  const generateSvgString = (forBlueprint: boolean) => {
    let bgColorStr = 'transparent';
    if (forBlueprint) {
      bgColorStr = '#0a192f'; // Blueprint dark blue
    } else {
      if (bgType === 'white') bgColorStr = '#ffffff';
      if (bgType === 'black') bgColorStr = '#1e262c';
      if (bgType === 'custom') bgColorStr = customBgColor;
    }

    let gridSvg = '';
    const lineArray = Object.values(gridLines) as CustomGridLine[];

    if (forBlueprint || gridMode !== 'none') {
      const mode = forBlueprint ? 'full' : gridMode;
      const linesToExport = lineArray.filter(l => {
        if (!l.visible) return false;
        if (mode === 'custom_only') return l.isCustomized;
        if (mode === 'main') return l.type === 'main' || l.isCustomized;
        if (mode === 'full') return true;
        return false;
      });

      const lineElements = linesToExport.map(l => {
        const x1 = l.axis === 'x' ? l.pos : 0;
        const y1 = l.axis === 'y' ? l.pos : 0;
        const x2 = l.axis === 'x' ? l.pos : 737;
        const y2 = l.axis === 'y' ? l.pos : 737;
        const strokeColor = forBlueprint ? (l.isCustomized ? l.color : '#3b82f6') : (l.isCustomized ? l.color : (l.type === 'main' ? '#000000' : '#cccccc'));
        const strokeOpacity = forBlueprint && !l.isCustomized ? 0.3 : (l.opacity || 0.2);
        
        return \`    <line x1="\${x1}" y1="\${y1}" x2="\${x2}" y2="\${y2}" stroke="\${strokeColor}" stroke-width="\${l.strokeWidth}" stroke-dasharray="\${l.dashArray === 'none' ? '' : l.dashArray}" stroke-opacity="\${strokeOpacity}" />\`;
      });
      gridSvg = \`\\n  <!-- Grid Lines -->\\n  <g id="grid-layer">\\n\${lineElements.join('\\n')}\\n  </g>\`;
    }

    const shapesSvg = shapes
      .map(shape => {
        if (shape.hidden) return '';
        const w = shape.widthX * 67;
        const h = shape.heightX * 67;
        const rx = Math.min(w, h) / 2;
        const isWf = exportWireframe || shape.wireframe || forBlueprint;
        const fill = isWf ? 'none' : shape.color;
        const stroke = isWf ? shape.color : 'none';
        const strokeWidth = isWf ? 2 : 0;
        return \`    <rect id="\${shape.id}" x="0" y="0" width="\${w}" height="\${h}" rx="\${rx}" fill="\${fill}" stroke="\${stroke}" stroke-width="\${strokeWidth}" transform="translate(\${shape.x}, \${shape.y}) rotate(\${shape.rot}, \${w / 2}, \${h / 2})" />\`;
      })
      .filter(Boolean)
      .join('\\n');

    let bgElement = '';
    if (bgColorStr !== 'transparent') {
      bgElement = \`<rect width="100%" height="100%" fill="\${bgColorStr}" />\\n\`;
    }

    return \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 737 737" width="737" height="737">
  <!-- Inlumenai Matrix Studio Export -->
  \${bgElement}\${gridSvg}
  <g id="shapes-layer">
\${shapesSvg}
  </g>
</svg>\`;
  };

  const handleExportSvg = () => {
    const svgString = generateSvgString(false);
    downloadFile(svgString, \`Matrix_Logo_\${Date.now()}.svg\`, 'image/svg+xml');
    showNotification('SVG descargado exitosamente', 'success');
  };

  const handleExportBlueprintSvg = () => {
    const svgString = generateSvgString(true);
    downloadFile(svgString, \`Matrix_Blueprint_\${Date.now()}.svg\`, 'image/svg+xml');
    showNotification('Blueprint SVG descargado', 'success');
  };

  const exportToPng = (forBlueprint: boolean) => {
    const svgString = generateSvgString(forBlueprint);
    const canvas = document.createElement('canvas');
    canvas.width = 1652; // Retina multiplier 2.24x approx for high res
    canvas.height = 1652;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const DOMURL = window.URL || window.webkitURL || window;
    const url = DOMURL.createObjectURL(svgBlob);
    
    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = forBlueprint ? '#0a192f' : (bgType === 'white' ? '#ffffff' : bgType === 'black' ? '#1e262c' : bgType === 'custom' ? customBgColor : 'transparent');
        if (ctx.fillStyle !== 'transparent') ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngUrl = canvas.toDataURL('image/png');
        downloadFile(pngUrl, \`Matrix_Logo_Retina_\${Date.now()}.png\`, 'image/png');
        showNotification(forBlueprint ? 'Blueprint PNG descargado' : 'PNG Retina descargado', 'success');
      }
      DOMURL.revokeObjectURL(url);
    };
    img.src = url;
  };
`;

content = content.replace(
  /const handleExportSvg = \(\) => {[\s\S]*?const handleCopyCode = \(\) => {/m,
  newMethod + "\n\n  const handleCopyCode = () => {\n    const svgString = generateSvgString(false);"
);

// We also need to update the handleCopyCode body since the original might be slightly different now.
content = content.replace(
  /const handleCopyCode = \(\) => {[\s\S]*?showNotification\('Código SVG copiado al portapapeles\.', 'success'\);\n    \} catch \(err\) {[\s\S]*?\n  };/m,
  `const handleCopyCode = async () => {
    const svgString = generateSvgString(false);
    try {
      await navigator.clipboard.writeText(svgString);
      showNotification('Código SVG copiado al portapapeles.', 'success');
    } catch (err) {
      showNotification('Error al copiar el código SVG.', 'error');
    }
  };`
);

// Now update the UI buttons
const uiButtons = `
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button onClick={handleExportSvg} className="flex flex-col items-center justify-center gap-2 p-3 bg-[#263238] border border-slate-600 hover:border-emerald-500 hover:bg-[#2c3a42] rounded-lg transition-colors group">
              <Download className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-slate-200">Exportar SVG</span>
              <span className="text-[10px] text-slate-400">Limpio y escalable</span>
            </button>
            <button onClick={() => exportToPng(false)} className="flex flex-col items-center justify-center gap-2 p-3 bg-[#263238] border border-slate-600 hover:border-emerald-500 hover:bg-[#2c3a42] rounded-lg transition-colors group">
              <Download className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-slate-200">Exportar PNG</span>
              <span className="text-[10px] text-slate-400">Retina (1652px)</span>
            </button>
            <button onClick={handleExportBlueprintSvg} className="flex flex-col items-center justify-center gap-2 p-3 bg-[#263238] border border-slate-600 hover:border-cyan-500 hover:bg-[#2c3a42] rounded-lg transition-colors group">
              <Download className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-slate-200">Blueprint SVG</span>
              <span className="text-[10px] text-slate-400">Trazos y cotas</span>
            </button>
            <button onClick={() => exportToPng(true)} className="flex flex-col items-center justify-center gap-2 p-3 bg-[#263238] border border-slate-600 hover:border-cyan-500 hover:bg-[#2c3a42] rounded-lg transition-colors group">
              <Download className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-slate-200">Blueprint PNG</span>
              <span className="text-[10px] text-slate-400">Imagen técnica</span>
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-3">
            <button onClick={handleCopyCode} className="flex items-center justify-center gap-2 p-2 bg-[#171d22] hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors">
              <FileCode className="w-4 h-4" /> Copiar Código SVG
            </button>
            <button onClick={handleDownloadJson} className="flex items-center justify-center gap-2 p-2 bg-[#171d22] hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors">
              <FileJson className="w-4 h-4" /> Descargar Proyecto
            </button>
          </div>
`;

content = content.replace(
  /<div className="grid grid-cols-2 gap-3 mt-4">[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/m,
  uiButtons + "\n        </div>\n      </div>\n    </div>"
);

fs.writeFileSync('src/components/matrix/MatrixExportModal.tsx', content);
