const fs = require('fs');
let content = fs.readFileSync('src/components/matrix/MatrixStudio.tsx', 'utf8');

content = content.replace(
  "import { MatrixShape, CustomGridLine, MatrixProjectData, LogoData } from '../../types/matrix';",
  "import { MatrixShape, CustomGridLine, MatrixProjectData } from '../../types/matrix';\nimport { LogoData } from '../../types';"
);

content = content.replace(
  "import { getAllShapeDistances } from '../../utils/matrixDimensionUtils';",
  "import { getAllShapeDistances } from '../../utils/matrixDistanceUtils';"
);

fs.writeFileSync('src/components/matrix/MatrixStudio.tsx', content);
