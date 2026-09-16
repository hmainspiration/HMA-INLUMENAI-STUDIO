import re

with open("src/data/hmaDefinitions.ts", "r") as f:
    content = f.read()

# Update hma-master-diagonal
content = re.sub(
    r'id:\s*"hma-master-diagonal",\s*name:\s*"[^"]+",\s*cluster:\s*"[^"]+",\s*description:\s*"[^"]+",\s*colorLuz:\s*"[^"]+",\s*colorProfundo:\s*"[^"]+"',
    'id: "hma-master-diagonal",\n    name: "COLOR (ISOTIPO BASE)",\n    cluster: "Marca Master",\n    description: "Plantilla oficial COLOR (ISOTIPO BASE)",\n    colorLuz: "#3D80FD",\n    colorProfundo: "#2D60C1"',
    content
)

with open("src/data/hmaDefinitions.ts", "w") as f:
    f.write(content)

