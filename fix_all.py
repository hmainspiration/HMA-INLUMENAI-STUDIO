import re
import sys
import json

mapping = {
    "hma-madre": {
        "serviceName": "HMA POSITIVO / NEGATIVO",
        "newName": "HMA POSITIVO / NEGATIVO",
        "cluster": "Marca Master",
        "luzColor": "#FEFAE8",
        "profundoColor": "#060C04",
    },
    "hma-design": {
        "serviceName": "HMA IMAGINATION",
        "newName": "HMA IMAGINATION",
        "cluster": "Identidad & Arte",
        "luzColor": "#3D80FD",
        "profundoColor": "#2D60C1",
    },
    "hma-type": {
        "serviceName": "HMA ALPHABETS",
        "newName": "HMA ALPHABETS",
        "cluster": "Identidad & Arte",
        "luzColor": "#AE7176",
        "profundoColor": "#77454A",
    },
    "hma-visuals": {
        "serviceName": "HMA ILLUSTRATIONS",
        "newName": "HMA ILLUSTRATIONS",
        "cluster": "Identidad & Arte",
        "luzColor": "#75C962",
        "profundoColor": "#4B893C",
    },
    "hma-photography": {
        "serviceName": "HMA LENSES",
        "newName": "HMA LENSES",
        "cluster": "Audiovisual & Sonido",
        "luzColor": "#052D63",
        "profundoColor": "#031C3D",
    },
    "hma-music": {
        "serviceName": "HMA MELODY",
        "newName": "HMA MELODY",
        "cluster": "Audiovisual & Sonido",
        "luzColor": "#108591",
        "profundoColor": "#074349",
    },
    "hma-cinema": {
        "serviceName": "HMA EXPERIENCES",
        "newName": "HMA EXPERIENCES",
        "cluster": "Audiovisual & Sonido",
        "luzColor": "#1D5B8F",
        "profundoColor": "#1B3F67",
    },
    "hma-temples": {
        "serviceName": "HMA ARCHITECTURE",
        "newName": "HMA ARCHITECTURE",
        "cluster": "Fe & Legado",
        "luzColor": "#7D77B0",
        "profundoColor": "#514B7D",
    },
    "hma-publishing": {
        "serviceName": "HMA NARRATIVES",
        "newName": "HMA NARRATIVES",
        "cluster": "Fe & Legado",
        "luzColor": "#C5A367",
        "profundoColor": "#82600A",
    },
    "hma-transcendence": {
        "serviceName": "HMA HERITAGE",
        "newName": "HMA HERITAGE",
        "cluster": "Fe & Legado",
        "luzColor": "#315629",
        "profundoColor": "#1B3315",
    },
    "hma-watermark": {
        "serviceName": "HMA UNDERLINE",
        "newName": "HMA UNDERLINE",
        "cluster": "Tecnología & Producción",
        "luzColor": "#D96B43",
        "profundoColor": "#964222",
    },
    "hma-software": {
        "serviceName": "HMA NETWORK",
        "newName": "HMA NETWORK",
        "cluster": "Tecnología & Producción",
        "luzColor": "#11D7B6",
        "profundoColor": "#0A826E",
    },
    "hma-print": {
        "serviceName": "HMA MERCHANDISE",
        "newName": "HMA MERCHANDISE",
        "cluster": "Tecnología & Producción",
        "luzColor": "#D7BB11",
        "profundoColor": "#8C7907",
    }
}

def process_canonical_logos():
    with open("src/data/canonicalLogos.ts", "r") as f:
        content = f.read()
    
    # Process item by item
    pattern = re.compile(r'\{\s*serviceId:\s*"([^"]+)",(.*?)(?=\s*\{|\s*\])', re.DOTALL)
    
    # Actually, the file structure is:
    # {
    #   serviceId: "...",
    #   serviceName: "...",
    #   clusterName: "...",
    #   luzColor: "...",
    #   profundoColor: "...",
    #   shapes: [ ... ]
    # }
    
    def repl(m):
        sid = m.group(1)
        block = m.group(0)
        
        if sid in mapping:
            new_data = mapping[sid]
            old_luz = re.search(r'luzColor:\s*"([^"]+)"', block).group(1)
            old_profundo = re.search(r'profundoColor:\s*"([^"]+)"', block).group(1)
            
            # Replace colors
            block = re.sub(rf'luzColor:\s*"{old_luz}"', f'luzColor: "{new_data["luzColor"]}"', block)
            block = re.sub(rf'profundoColor:\s*"{old_profundo}"', f'profundoColor: "{new_data["profundoColor"]}"', block)
            
            # Replace shapes colors
            block = block.replace(f'color: "{old_luz}"', f'color: "{new_data["luzColor"]}"')
            block = block.replace(f'color: "{old_profundo}"', f'color: "{new_data["profundoColor"]}"')
            
            # Replace serviceName
            block = re.sub(r'serviceName:\s*"([^"]+)"', f'serviceName: "{new_data["serviceName"]}"', block)
            
            # Replace clusterName (if we want to sync it)
            # clusterName: "Clúster 01 — Identidad & Arte" -> keep old prefix if any, or replace
            # "Marca Master" has no cluster number in the image.
            
            # Let's just keep the old cluster name if it matches roughly or replace it.
            # I will just replace the clusterName entirely with the one from the image to be safe.
            if sid == 'hma-madre':
                block = re.sub(r'clusterName:\s*"([^"]+)"', f'clusterName: "Marca Master"', block)
            elif "Identidad & Arte" in new_data["cluster"]:
                block = re.sub(r'clusterName:\s*"([^"]+)"', f'clusterName: "Clúster 01 — Identidad & Arte"', block)
            elif "Audiovisual & Sonido" in new_data["cluster"]:
                block = re.sub(r'clusterName:\s*"([^"]+)"', f'clusterName: "Clúster 02 — Audiovisual & Sonido"', block)
            elif "Fe & Legado" in new_data["cluster"]:
                block = re.sub(r'clusterName:\s*"([^"]+)"', f'clusterName: "Clúster 03 — Fe & Legado"', block)
            elif "Tecnología & Producción" in new_data["cluster"]:
                block = re.sub(r'clusterName:\s*"([^"]+)"', f'clusterName: "Clúster 04 — Tecnología & Producción"', block)
                
        return block

    # We can split by serviceId to be safer.
    # A simple approach is split by 'serviceId: "'
    parts = content.split('serviceId: "')
    out = [parts[0]]
    for p in parts[1:]:
        sid = p.split('"', 1)[0]
        if sid in mapping:
            new_data = mapping[sid]
            old_luz_match = re.search(r'luzColor:\s*"([^"]+)"', p)
            old_profundo_match = re.search(r'profundoColor:\s*"([^"]+)"', p)
            
            if old_luz_match and old_profundo_match:
                old_luz = old_luz_match.group(1)
                old_profundo = old_profundo_match.group(1)
                
                # Replace in this block
                p = re.sub(rf'luzColor:\s*"{old_luz}"', f'luzColor: "{new_data["luzColor"]}"', p)
                p = re.sub(rf'profundoColor:\s*"{old_profundo}"', f'profundoColor: "{new_data["profundoColor"]}"', p)
                p = p.replace(f'color: "{old_luz}"', f'color: "{new_data["luzColor"]}"')
                p = p.replace(f'color: "{old_profundo}"', f'color: "{new_data["profundoColor"]}"')
            
            p = re.sub(r'serviceName:\s*"([^"]+)"', f'serviceName: "{new_data["serviceName"]}"', p)
            
            if sid == 'hma-madre':
                p = re.sub(r'clusterName:\s*"([^"]+)"', f'clusterName: "Marca Master"', p)
            elif "Identidad & Arte" in new_data["cluster"]:
                p = re.sub(r'clusterName:\s*"([^"]+)"', f'clusterName: "Clúster 01 — Identidad & Arte"', p)
            elif "Audiovisual & Sonido" in new_data["cluster"]:
                p = re.sub(r'clusterName:\s*"([^"]+)"', f'clusterName: "Clúster 02 — Audiovisual & Sonido"', p)
            elif "Fe & Legado" in new_data["cluster"]:
                p = re.sub(r'clusterName:\s*"([^"]+)"', f'clusterName: "Clúster 03 — Fe & Legado"', p)
            elif "Tecnología & Producción" in new_data["cluster"]:
                p = re.sub(r'clusterName:\s*"([^"]+)"', f'clusterName: "Clúster 04 — Tecnología & Producción"', p)

        out.append('serviceId: "' + p)

    with open("src/data/canonicalLogos.ts", "w") as f:
        f.write("".join(out))

process_canonical_logos()

# Need to do the same for data.ts
def process_data_ts():
    with open("src/data/data.ts", "r") as f:
        content = f.read()

    parts = content.split('serviceId: "')
    out = [parts[0]]
    for p in parts[1:]:
        sid = p.split('"', 1)[0]
        if sid in mapping:
            new_data = mapping[sid]
            old_luz_match = re.search(r'colorLuz:\s*"([^"]+)"', p)
            old_profundo_match = re.search(r'colorProfundo:\s*"([^"]+)"', p)
            
            if old_luz_match and old_profundo_match:
                old_luz = old_luz_match.group(1)
                old_profundo = old_profundo_match.group(1)
                
                p = re.sub(rf'colorLuz:\s*"{old_luz}"', f'colorLuz: "{new_data["luzColor"]}"', p)
                p = re.sub(rf'colorProfundo:\s*"{old_profundo}"', f'colorProfundo: "{new_data["profundoColor"]}"', p)
                p = p.replace(f'color: "{old_luz}"', f'color: "{new_data["luzColor"]}"')
                p = p.replace(f'color: "{old_profundo}"', f'color: "{new_data["profundoColor"]}"')
            
            p = re.sub(r'serviceName:\s*"([^"]+)"', f'serviceName: "{new_data["serviceName"]}"', p)
        out.append('serviceId: "' + p)
        
    with open("src/data/data.ts", "w") as f:
        f.write("".join(out))

process_data_ts()

# Need to do the same for presets.ts
def process_presets_ts():
    with open("src/data/presets.ts", "r") as f:
        content = f.read()

    # LEGACY_PRESETS_DATA = [
    #  { id: 'hma-print', name: 'Print', cluster: 'Print & Media', fn: getPresetPrint, cLuz: '#C99700', cProf: '#8C6900' },
    
    # We can do line by line for this block
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if "id: '" in line or 'id: "' in line:
            for sid, new_data in mapping.items():
                if f"id: '{sid}'" in line or f'id: "{sid}"' in line:
                    line = re.sub(r'name:\s*\'[^\']+\'', f"name: '{new_data['serviceName'].replace('HMA ', '').title()}'", line)
                    line = re.sub(r'cLuz:\s*\'[^\']+\'', f"cLuz: '{new_data['luzColor']}'", line)
                    line = re.sub(r'cProf:\s*\'[^\']+\'', f"cProf: '{new_data['profundoColor']}'", line)
                    # For hma-madre, we might need to handle 'hma-master-logo' instead since presets.ts has 'hma-master-logo'
                    lines[i] = line
                    
        # Replace function body colors? Actually the functions don't hardcode colors, they use colorLuz and colorProfundo args.
    
    with open("src/data/presets.ts", "w") as f:
        f.write('\n'.join(lines))

process_presets_ts()

# hmaDefinitions.ts
def process_hmaDefinitions():
    with open("src/data/hmaDefinitions.ts", "r") as f:
        content = f.read()
        
    parts = content.split('id: "')
    out = [parts[0]]
    for p in parts[1:]:
        sid = p.split('"', 1)[0]
        if sid in mapping:
            new_data = mapping[sid]
            p = re.sub(r'name:\s*"([^"]+)"', f'name: "{new_data["serviceName"]}"', p)
        out.append('id: "' + p)
    
    with open("src/data/hmaDefinitions.ts", "w") as f:
        f.write("".join(out))

process_hmaDefinitions()

print("done")
