with open("src/data/canonicalLogos.ts", "r") as f:
    content = f.read()

content = content.replace("  {\n  {\n  {\n    serviceId: \"hma-madre\",", "  {\n    serviceId: \"hma-madre\",")
content = content.replace("  {\n  {\n    serviceId: \"hma-madre\",", "  {\n    serviceId: \"hma-madre\",")

with open("src/data/canonicalLogos.ts", "w") as f:
    f.write(content)
