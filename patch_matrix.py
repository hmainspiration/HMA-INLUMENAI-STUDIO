import re

with open('src/components/matrix/MatrixStudio.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Add imports for templates and history states
imports_to_add = """import { Undo, Redo, Grid3X3, Layers } from 'lucide-react';
import { MATRIX_TEMPLATES } from '../../data/matrixTemplates';
"""

if "MATRIX_TEMPLATES" not in code:
    code = code.replace("import { getAllShapeDistances } from '../../utils/matrixDistanceUtils';", "import { getAllShapeDistances } from '../../utils/matrixDistanceUtils';\n" + imports_to_add)

# Add states for undo/redo
states = """  const [past, setPast] = useState<MatrixShape[][]>([]);
  const [future, setFuture] = useState<MatrixShape[][]>([]);

  const commitShapes = (newShapes: MatrixShape[] | ((prev: MatrixShape[]) => MatrixShape[])) => {
    if (typeof newShapes === 'function') {
      setShapes(prev => {
        const result = newShapes(prev);
        setPast(p => [...p, prev]);
        setFuture([]);
        return result;
      });
    } else {
      setPast(p => [...p, shapes]);
      setFuture([]);
      setShapes(newShapes);
    }
  };

  const undo = () => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    setFuture(prev => [shapes, ...prev]);
    setPast(newPast);
    setShapes(previous);
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    setPast(prev => [...prev, shapes]);
    setFuture(newFuture);
    setShapes(next);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [past, future, shapes]);

  const [templateDropdownOpen, setTemplateDropdownOpen] = useState(false);
"""

if "const commitShapes" not in code:
    code = code.replace("const [importModalOpen, setImportModalOpen] = useState(false);", "const [importModalOpen, setImportModalOpen] = useState(false);\n" + states)

# Replace setShapes with commitShapes, except inside commitShapes itself!
# We can just manually replace the known instances carefully.

replacements = [
    ("setShapes(prev => prev.filter(s => !selectedShapeIds.includes(s.id)));", "commitShapes(prev => prev.filter(s => !selectedShapeIds.includes(s.id)));"),
    ("setShapes([...shapes, newShape]);", "commitShapes([...shapes, newShape]);"),
    ("setShapes(prev => prev.map(shape => {", "commitShapes(prev => prev.map(shape => {"),
    ("setShapes(prev => prev.map(s => ({", "commitShapes(prev => prev.map(s => ({"),
    ("setShapes(prev => prev.map(s => {", "commitShapes(prev => prev.map(s => {"),
    ("setShapes(prev => {", "commitShapes(prev => {"),
    ("setShapes(imported);", "commitShapes(imported);"),
    ("setShapes(p => [...p, ...imported]);", "commitShapes(p => [...p, ...imported]);"),
    ("onUpdate={updates => setShapes(prev => prev.map(s => selectedShapeIds.includes(s.id) ? { ...s, ...updates } : s))}", "onUpdate={updates => commitShapes(prev => prev.map(s => selectedShapeIds.includes(s.id) ? { ...s, ...updates } : s))}")
]

for old, new in replacements:
    code = code.replace(old, new)

# Now inject the UI for Templates and Undo/Redo
ui_injection = """
            <div className="flex items-center gap-1.5 ml-2 border-l border-slate-700/50 pl-3">
              <button onClick={undo} disabled={past.length === 0} className={`p-1.5 rounded transition-colors ${past.length === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`} title="Deshacer (Ctrl+Z)">
                <Undo className="w-4 h-4" />
              </button>
              <button onClick={redo} disabled={future.length === 0} className={`p-1.5 rounded transition-colors ${future.length === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`} title="Rehacer (Ctrl+Y)">
                <Redo className="w-4 h-4" />
              </button>
            </div>
            
            <div className="relative ml-2 border-l border-slate-700/50 pl-3">
              <button onClick={() => setTemplateDropdownOpen(!templateDropdownOpen)} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold shadow-sm transition-colors">
                <Grid3X3 className="w-3.5 h-3.5" />
                PLANTILLAS
              </button>
              {templateDropdownOpen && (
                <div className="absolute top-full mt-2 w-56 bg-[#1a2228] border border-slate-700 rounded-lg shadow-xl py-1 z-50">
                  <div className="px-3 py-2 border-b border-slate-700/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Plantillas Oficiales
                  </div>
                  <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
                    {MATRIX_TEMPLATES.map((tpl, i) => (
                      <button key={i} onClick={() => { commitShapes(tpl.shapes); setTemplateDropdownOpen(false); setSelectedShapeIds([]); }} className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center justify-between">
                        <span>{tpl.name}</span>
                        <span className="text-[9px] text-slate-500">{tpl.shapes.length} pz</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
"""

# Find the header actions container to inject this
# "exportModalOpen" is close by
# Let's find: <button onClick={handleExportToMotion} className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded text-xs">A MOTION</button>
target_ui = """              <button onClick={handleExportToMotion} className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded text-xs">A MOTION</button>
            </div>"""

if ui_injection not in code:
    code = code.replace(target_ui, target_ui.replace("</div>", ui_injection + "\n            </div>"))

with open('src/components/matrix/MatrixStudio.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Done patching MatrixStudio.tsx")

