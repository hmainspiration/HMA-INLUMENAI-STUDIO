import re
with open("src/data/data.ts", "r") as f:
    content = f.read()

# find the block for hma-madre
match = re.search(r'\{\s*serviceId:\s*"hma-madre",(.*?)(?=\s*\{|\s*\])', content, re.DOTALL)
if match:
    block = match.group(0)
    # duplicate block
    new_block = block.replace('"hma-madre"', '"hma-madre-color"')
    new_block = new_block.replace('"HMA POSITIVO / NEGATIVO"', '"HMA COLOR (ISOTIPO BASE)"')
    new_block = new_block.replace('"#FEFAE8"', '"#3D80FD"')
    new_block = new_block.replace('"#060C04"', '"#2D60C1"')
    
    # insert
    content = content.replace(block, block + ',\n  ' + new_block)
    
    with open("src/data/data.ts", "w") as f:
        f.write(content)
