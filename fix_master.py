import re

with open("src/data/presets.ts", "r") as f:
    content = f.read()

# Update hma-master-diagonal
content = re.sub(r"\{\s*id:\s*'hma-master-diagonal',\s*name:\s*'[^']+',", "{ id: 'hma-master-diagonal', name: 'Color (Isotipo Base)',", content)

# Update hma-master-logo
content = re.sub(r"\{\s*id:\s*'hma-master-logo',\s*name:\s*'[^']+',(.*?cLuz:\s*')[^']+('.*?cProf:\s*')[^']+'", r"{ id: 'hma-master-logo', name: 'Positivo / Negativo',\1#FEFAE8\2#060C04'", content)

with open("src/data/presets.ts", "w") as f:
    f.write(content)

