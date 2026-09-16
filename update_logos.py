import re

mapping = {
    "HMA DESIGN": ("HMA IMAGINATION", "#3D80FD", "#2D60C1"),
    "HMA TYPE": ("HMA ALPHABETS", "#AE7176", "#77454A"),
    "HMA VISUALS": ("HMA ILLUSTRATIONS", "#75C962", "#4B893C"),
    "HMA PHOTOGRAPHY": ("HMA LENSES", "#052D63", "#031C3D"),
    "HMA MUSIC": ("HMA MELODY", "#108591", "#074349"),
    "HMA CINEMA": ("HMA EXPERIENCES", "#1D5B8F", "#1B3F67"),
    "HMA TEMPLES": ("HMA ARCHITECTURE", "#7D77B0", "#514B7D"),
    "HMA PUBLISHING": ("HMA NARRATIVES", "#C5A367", "#82600A"),
    "HMA TRANSCENDENCE": ("HMA HERITAGE", "#315629", "#1B3315"),
    "HMA WATERMARK": ("HMA UNDERLINE", "#D96B43", "#964222"),
    "HMA SOFTWARE": ("HMA NETWORK", "#11D7B6", "#0A826E"),
    "HMA PRINT": ("HMA MERCHANDISE", "#D7BB11", "#8C7907"),
}

with open("src/data/canonicalLogos.ts", "r") as f:
    content = f.read()

# For each item in INITIAL_DATA, we'll replace the names and colors.
for old_name, (new_name, luz, prof) in mapping.items():
    # Update serviceName
    content = re.sub(rf'serviceName:\s*"{old_name}"', f'serviceName: "{new_name}"', content)

with open("src/data/canonicalLogos.ts", "w") as f:
    f.write(content)

print("Done")
