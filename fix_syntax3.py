with open("src/data/canonicalLogos.ts", "r") as f:
    lines = f.readlines()

out = []
in_broken_madre = False
in_madre_color = False
madre_color_shapes_lines = []

idx = 0
while idx < len(lines):
    line = lines[idx]
    if 'serviceId: "hma-madre"' in line:
        in_broken_madre = True
    
    if in_broken_madre and 'shapes: [,' in line:
        in_broken_madre = False # Done skipping the broken part
        idx += 1
        continue
    
    if in_broken_madre:
        idx += 1
        continue

    if 'serviceId: "hma-madre-color"' in line:
        in_madre_color = True
        
    if in_madre_color:
        madre_color_shapes_lines.append(line)
        if 'serviceId: "hma-design"' in lines[idx+1] if idx+1 < len(lines) else False:
            in_madre_color = False
            # We reached the end of hma-madre-color
            # Let's extract the shapes from madre_color_shapes_lines
            # They start after 'shapes: [\n' and end at '    ],\n'
            shapes_str = "".join(madre_color_shapes_lines)
            shapes_start = shapes_str.find("shapes: [")
            
            # shapes for madre
            s_madre = shapes_str[shapes_start:].replace('"#060C04"', '"#2D60C1"').replace('"#FEFAE8"', '"#3D80FD"')
            s_madre = s_madre.replace('"#2D60C1"', '"#060C04"').replace('"#3D80FD"', '"#FEFAE8"')
            
            # shapes for color
            s_color = shapes_str[shapes_start:].replace('"#060C04"', '"#2D60C1"').replace('"#FEFAE8"', '"#3D80FD"')
            
            out.append("""  {
    serviceId: "hma-madre",
    serviceName: "HMA POSITIVO / NEGATIVO",
    clusterName: "Marca Master",
    luzColor: "#FEFAE8",
    profundoColor: "#060C04",
    """ + s_madre)
            
            out.append("""  {
    serviceId: "hma-madre-color",
    serviceName: "HMA COLOR (ISOTIPO BASE)",
    clusterName: "Marca Master",
    luzColor: "#3D80FD",
    profundoColor: "#2D60C1",
    """ + s_color)
            
            idx += 1
            continue
            
    if not in_broken_madre and not in_madre_color:
        out.append(line)
        
    idx += 1

with open("src/data/canonicalLogos.ts", "w") as f:
    f.write("".join(out))
print("Done")
