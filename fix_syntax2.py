import re

with open("src/data/canonicalLogos.ts", "r") as f:
    content = f.read()

# We need to extract the shapes array that belongs to hma-madre-color
match = re.search(r'serviceId:\s*"hma-madre-color".*?shapes:\s*(\[\s*\{.*?\}\s*,?\s*\])\s*\},?\s*\{\s*serviceId:\s*"hma-design"', content, re.DOTALL)

if match:
    shapes_str = match.group(1)
    
    shapes_madre = shapes_str.replace('"#060C04"', '"#FEFAE8"').replace('"#3D80FD"', '"#FEFAE8"').replace('"#2D60C1"', '"#060C04"')
    # Wait, the current colors in hma-madre-color are what? I see "#060C04" in the head output.
    # The original colors for hma-madre were #3D80FD and #2D60C1.
    # We want shapes_madre to have #FEFAE8 and #060C04.
    # Let's just do a naive replace:
    shapes_madre = shapes_str.replace('"#060C04"', '"#2D60C1"').replace('"#3D80FD"', '"#3D80FD"')
    shapes_madre = shapes_madre.replace('"#2D60C1"', '"#060C04"').replace('"#3D80FD"', '"#FEFAE8"')
    
    shapes_color = shapes_str.replace('"#060C04"', '"#2D60C1"')
    
    # replace the top part
    top_broken = re.search(r'\{\s*serviceId:\s*"hma-madre".*?shapes:\s*\[,.*?(?=\s*\{\s*serviceId:\s*"hma-design")', content, re.DOTALL)
    
    if top_broken:
        new_text = """  {
    serviceId: "hma-madre",
    serviceName: "HMA POSITIVO / NEGATIVO",
    clusterName: "Marca Master",
    luzColor: "#FEFAE8",
    profundoColor: "#060C04",
    shapes: """ + shapes_madre + """
  },
  {
    serviceId: "hma-madre-color",
    serviceName: "HMA COLOR (ISOTIPO BASE)",
    clusterName: "Marca Master",
    luzColor: "#3D80FD",
    profundoColor: "#2D60C1",
    shapes: """ + shapes_color + """
  },"""
        content = content.replace(top_broken.group(0), new_text)
        
        with open("src/data/canonicalLogos.ts", "w") as f:
            f.write(content)
        print("Fixed top part")
    else:
        print("Could not find top broken part")
else:
    print("Could not find shapes string")
