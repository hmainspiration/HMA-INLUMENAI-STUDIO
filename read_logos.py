import re

with open("src/data/canonicalLogos.ts", "r") as f:
    content = f.read()

items = re.findall(r'serviceName:\s*"([^"]+)",\s*clusterName:\s*"([^"]+)",\s*luzColor:\s*"([^"]+)",\s*profundoColor:\s*"([^"]+)"', content)
for item in items:
    print(item)
