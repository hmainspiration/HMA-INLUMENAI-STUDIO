const fs = require('fs');
let content = fs.readFileSync('src/components/matrix/MatrixStudio.tsx', 'utf8');

const replacement = `
        {/* Inspector Lateral de Guías */}
        {guidesManagerOpen && (
          <MatrixGuidesManager
            lines={gridLines}
            selectedLineId={selectedLineId}
            onSelectLine={setSelectedLineId}
            onUpdateLine={handleUpdateLine}
            onBatchUpdateLines={handleBatchUpdateLines}
            onResetAllLines={handleResetAllLines}
            onClose={() => setGuidesManagerOpen(false)}
            showNotification={showNotification}
            guidesLocked={guidesLocked}
            onToggleGuidesLocked={() => setGuidesLocked(!guidesLocked)}
          />
        )}
      </div>

      <MatrixInspector 
        selectedShapes={shapes.filter(s => selectedShapeIds.includes(s.id))}
        onUpdate={(updates) => {
          setShapes(prev => prev.map(s => selectedShapeIds.includes(s.id) ? { ...s, ...updates } : s));
        }}
        onLayerChange={handleLayerChange}
        onSnapToGrid={snapAllToGrid}
        snapMode={snapMode}
      />
    </div>

    {/* MODALS */}
`;

content = content.replace(
  /{guidesManagerOpen && \([\s\S]*?<\/div>[\s\S]*?{\/\* MODAL: Exportar Formas/g,
  replacement + "\n      {/* MODAL: Exportar Formas"
);

fs.writeFileSync('src/components/matrix/MatrixStudio.tsx', content);
