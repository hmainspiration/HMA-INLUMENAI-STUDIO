import re

with open("src/data/canonicalLogos.ts", "r") as f:
    content = f.read()

# find the shapes array that follows hma-madre-color
# The array ends where the next serviceId ("hma-design") begins.
# Let's just find everything from `shapes: [\n      {` up to `    ],\n  },\n  {\n    serviceId: "hma-design"`

match = re.search(r'serviceId:\s*"hma-madre-color".*?shapes:\s*\[(.*?)\]\s*\},?\s*\{\s*serviceId:\s*"hma-design"', content, re.DOTALL)
if match:
    shapes_str = match.group(1)
    
    # Create the shapes for hma-madre
    shapes_madre = shapes_str.replace('"#3D80FD"', '"#FEFAE8"').replace('"#2D60C1"', '"#060C04"')
    # Wait, the current shapes_str has "#FEFAE8" and "#060C04" because they were processed by fix_all.py!
    # Let's check what colors they have. We saw "#060C04" and "#FEFAE8".
    
    shapes_madre = shapes_str
    
    # Create the shapes for hma-madre-color
    shapes_color = shapes_str.replace('"#FEFAE8"', '"#3D80FD"').replace('"#060C04"', '"#2D60C1"')
    
    # Now replace the broken part
    broken_part = re.search(r'\{\s*serviceId:\s*"hma-madre".*?shapes:\s*\[,.*?serviceId:\s*"hma-madre-color".*?shapes:\s*\[(.*?)\]\s*\},?', content, re.DOTALL)
    
    new_madre = """  {
    serviceId: "hma-madre",
    serviceName: "HMA POSITIVO / NEGATIVO",
    clusterName: "Marca Master",
    luzColor: "#FEFAE8",
    profundoColor: "#060C04",
    shapes: [""" + shapes_madre + """],
  },
  {
    serviceId: "hma-madre-color",
    serviceName: "HMA COLOR (ISOTIPO BASE)",
    clusterName: "Marca Master",
    luzColor: "#3D80FD",
    profundoColor: "#2D60C1",
    shapes: [""" + shapes_color + """],
  },"""
    
    content = content.replace(broken_part.group(0), new_madre)
    
    with open("src/data/canonicalLogos.ts", "w") as f:
        f.write(content)
