with open("src/data/canonicalLogos.ts", "r") as f:
    content = f.read()

content = content.replace("  {\n  {\n    serviceId: \"hma-madre-color\",", "  {\n    serviceId: \"hma-madre-color\",")

with open("src/data/canonicalLogos.ts", "w") as f:
    f.write(content)
