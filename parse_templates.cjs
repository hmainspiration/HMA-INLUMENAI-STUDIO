const fs = require('fs');

const rawSvgData = `
### 00#HMA MASTER (DIAGONAL)
*(Luz: \`#3D80FD\` | Profundo: \`#2D60C1\`)*
  <g id="hma-isotype" data-service="HMA MASTER (DIAGONAL)">
    <rect id="forma-08" x="-33.5" y="-201" width="67" height="402" rx="33.5" ry="33.5" fill="#3D80FD" opacity="1" transform="translate(152.43 389.31) rotate(45)" />
    <rect id="forma-06" x="-33.5" y="-33.5" width="67" height="67" rx="33.5" ry="33.5" fill="#3D80FD" opacity="1" transform="translate(484.07 484.07) rotate(-45)" />
    <rect id="forma-07" x="-33.5" y="-201" width="67" height="402" rx="33.5" ry="33.5" fill="#3D80FD" opacity="1" transform="translate(389.31 673.57) rotate(-45)" />
    <rect id="forma-09" x="-33.5" y="-201" width="67" height="402" rx="33.5" ry="33.5" fill="#2D60C1" opacity="1" transform="translate(673.57 436.69) rotate(45)" />
    <rect id="forma-10" x="-33.5" y="-134" width="67" height="268" rx="33.5" ry="33.5" fill="#2D60C1" opacity="1" transform="translate(270.87 413.01) rotate(45)" />
    <rect id="forma-11" x="-33.5" y="-134" width="67" height="268" rx="33.5" ry="33.5" fill="#3D80FD" opacity="1" transform="translate(412.99 270.87) rotate(-45)" />
    <rect id="forma-12" x="-33.5" y="-134" width="67" height="268" rx="33.5" ry="33.5" fill="#2D60C1" opacity="1" transform="translate(413.01 555.13) rotate(-45)" />
    <rect id="forma-13" x="-33.5" y="-201" width="67" height="402" rx="33.5" ry="33.5" fill="#2D60C1" opacity="1" transform="translate(436.69 152.43) rotate(-45)" />
    <rect id="forma-03" x="-33.5" y="-83.75" width="67" height="167.5" rx="33.5" ry="33.5" fill="#3D80FD" opacity="1" transform="translate(293.4 354.95) rotate(-105)" />
    <rect id="forma-05" x="-33.5" y="-83.75" width="67" height="167.5" rx="33.5" ry="33.5" fill="#2D60C1" opacity="1" transform="translate(257.86 319.42) rotate(15)" />
    <rect id="forma-01" x="-33.5" y="-83.75" width="67" height="167.5" rx="33.5" ry="33.5" fill="#3D80FD" opacity="1" transform="translate(448.53 235.34) rotate(45)" />
    <rect id="forma-04" x="-33.5" y="-83.75" width="67" height="167.5" rx="33.5" ry="33.5" fill="#2D60C1" opacity="1" transform="translate(306.41 519.6) rotate(45)" />
    <rect id="forma-02" x="-33.5" y="-83.75" width="67" height="167.5" rx="33.5" ry="33.5" fill="#3D80FD" opacity="1" transform="translate(377.47 590.66) rotate(45)" />
  </g>

### 01#HMA HERITAGE
*(Luz: \`#315629\` | Profundo: \`#1B3315\`)*
  <g id="hma-isotype" data-service="HMA HERITAGE">
    <rect id="forma-01" x="-33.5" y="-201" width="67" height="402" rx="33.5" ry="33.5" fill="#315629" opacity="1" transform="translate(379.5 279) rotate(90)" />
    <rect id="forma-02" x="-33.5" y="-83.75" width="67" height="167.5" rx="33.5" ry="33.5" fill="#315629" opacity="1" transform="translate(279 195.25) rotate(180)" />
    <rect id="forma-03" x="-33.5" y="-83.75" width="67" height="167.5" rx="33.5" ry="33.5" fill="#315629" opacity="1" transform="translate(413 362.75) rotate(0)" />
    <rect id="forma-04" x="-33.5" y="-134" width="67" height="268" rx="33.5" ry="33.5" fill="#1B3315" opacity="1" transform="translate(262.25 111.5) rotate(-90)" />
    <rect id="forma-05" x="-33.5" y="-201" width="67" height="402" rx="33.5" ry="33.5" fill="#1B3315" opacity="1" transform="translate(496.75 446.5) rotate(90)" />
    <rect id="forma-06" x="-33.5" y="-33.5" width="67" height="67" rx="33.5" ry="33.5" fill="#315629" opacity="1" transform="translate(580.5 111.5) rotate(0)" />
    <rect id="forma-07" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#1B3315" opacity="1" transform="translate(161.75 647.5) rotate(0)" />
    <rect id="forma-08" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#1B3315" opacity="1" transform="translate(262.25 647.5) rotate(0)" />
    <rect id="forma-09" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#315629" opacity="1" transform="translate(362.75 647.5) rotate(0)" />
    <rect id="forma-11" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#1B3315" opacity="1" transform="translate(463.25 647.5) rotate(0)" />
    <rect id="forma-10" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#315629" opacity="1" transform="translate(415.87 627.88) rotate(45)" />
    <rect id="forma-12" x="-33.5" y="-107.2" width="67" height="214.4" rx="33.5" ry="33.5" fill="#1B3315" opacity="1" transform="translate(639.04 645.24) rotate(-20)" />
    <rect id="forma-13" x="-33.5" y="-107.2" width="67" height="214.4" rx="33.5" ry="33.5" fill="#315629" opacity="1" transform="translate(588.96 645.24) rotate(20)" />
  </g>

### 02#HMA MELODY
*(Luz: \`#108591\` | Profundo: \`#074349\`)*
  <g id="hma-isotype" data-service="HMA MELODY">
    <rect id="forma-01" x="-33.5" y="-201" width="67" height="402" rx="33.5" ry="33.5" fill="#108591" opacity="1" transform="translate(362.75 279) rotate(0)" />
    <rect id="forma-02" x="-33.5" y="-134" width="67" height="268" rx="33.5" ry="33.5" fill="#074349" opacity="1" transform="translate(463.25 346) rotate(0)" />
    <rect id="forma-03" x="-33.5" y="-134" width="67" height="268" rx="33.5" ry="33.5" fill="#108591" opacity="1" transform="translate(262.25 346) rotate(0)" />
    <rect id="forma-04" x="-33.5" y="-83.75" width="67" height="167.5" rx="33.5" ry="33.5" fill="#074349" opacity="1" transform="translate(161.75 396.25) rotate(0)" />
    <rect id="forma-05" x="-33.5" y="-67" width="67" height="134" rx="33.5" ry="33.5" fill="#108591" opacity="1" transform="translate(563.75 413) rotate(0)" />
    <rect id="forma-06" x="-33.5" y="-33.5" width="67" height="67" rx="33.5" ry="33.5" fill="#108591" opacity="1" transform="translate(664.25 446.5) rotate(0)" />
    <rect id="forma-07" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#074349" opacity="1" transform="translate(161.75 647.5) rotate(0)" />
    <rect id="forma-08" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#074349" opacity="1" transform="translate(262.25 647.5) rotate(0)" />
    <rect id="forma-09" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#108591" opacity="1" transform="translate(362.75 647.5) rotate(0)" />
    <rect id="forma-11" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#074349" opacity="1" transform="translate(463.25 647.5) rotate(0)" />
    <rect id="forma-10" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#108591" opacity="1" transform="translate(415.87 627.88) rotate(45)" />
    <rect id="forma-12" x="-33.5" y="-107.2" width="67" height="214.4" rx="33.5" ry="33.5" fill="#074349" opacity="1" transform="translate(639.04 645.24) rotate(-20)" />
    <rect id="forma-13" x="-33.5" y="-107.2" width="67" height="214.4" rx="33.5" ry="33.5" fill="#108591" opacity="1" transform="translate(588.96 645.24) rotate(20)" />
  </g>

### 03#HMA ARCHITECTURE
*(Luz: \`#7D77B0\` | Profundo: \`#514B7D\`)*
  <g id="hma-isotype" data-service="HMA ARCHITECTURE">
    <rect id="forma-01" x="-33.5" y="-134" width="67" height="268" rx="33.5" ry="33.5" fill="#7D77B0" opacity="1" transform="translate(413 346) rotate(90)" />
    <rect id="forma-02" x="-33.5" y="-83.75" width="67" height="167.5" rx="33.5" ry="33.5" fill="#7D77B0" opacity="1" transform="translate(212 446.5) rotate(-90)" />
    <rect id="forma-03" x="-33.5" y="-83.75" width="67" height="167.5" rx="33.5" ry="33.5" fill="#7D77B0" opacity="1" transform="translate(614 446.5) rotate(90)" />
    <rect id="forma-04" x="-33.5" y="-134" width="67" height="268" rx="33.5" ry="33.5" fill="#514B7D" opacity="1" transform="translate(413 446.5) rotate(90)" />
    <rect id="forma-05" x="-33.5" y="-83.75" width="67" height="167.5" rx="33.5" ry="33.5" fill="#514B7D" opacity="1" transform="translate(413 195.25) rotate(0)" />
    <rect id="forma-06" x="-33.5" y="-33.5" width="67" height="67" rx="33.5" ry="33.5" fill="#7D77B0" opacity="1" transform="translate(413 94.75) rotate(0)" />
    <rect id="forma-07" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#514B7D" opacity="1" transform="translate(161.75 647.5) rotate(0)" />
    <rect id="forma-08" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#514B7D" opacity="1" transform="translate(262.25 647.5) rotate(0)" />
    <rect id="forma-09" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#7D77B0" opacity="1" transform="translate(362.75 647.5) rotate(0)" />
    <rect id="forma-11" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#514B7D" opacity="1" transform="translate(463.25 647.5) rotate(0)" />
    <rect id="forma-10" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#7D77B0" opacity="1" transform="translate(415.87 627.88) rotate(45)" />
    <rect id="forma-12" x="-33.5" y="-107.2" width="67" height="214.4" rx="33.5" ry="33.5" fill="#514B7D" opacity="1" transform="translate(639.04 645.24) rotate(-20)" />
    <rect id="forma-13" x="-33.5" y="-107.2" width="67" height="214.4" rx="33.5" ry="33.5" fill="#7D77B0" opacity="1" transform="translate(588.96 645.24) rotate(20)" />
  </g>

### 04#HMA IMAGINATION
*(Luz: \`#3D80FD\` | Profundo: \`#2D60C1\`)*
  <g id="hma-isotype" data-service="HMA IMAGINATION">
    <rect id="forma-01" x="-33.5" y="-134" width="67" height="268" rx="33.5" ry="33.5" fill="#3D80FD" opacity="1" transform="translate(522.75 197.25) rotate(-35)" />
    <rect id="forma-02" x="-33.5" y="-67" width="67" height="134" rx="33.5" ry="33.5" fill="#3D80FD" opacity="1" transform="translate(362.75 413) rotate(0)" />
    <rect id="forma-03" x="-33.5" y="-67" width="67" height="134" rx="33.5" ry="33.5" fill="#3D80FD" opacity="1" transform="translate(362.75 145) rotate(0)" />
    <rect id="forma-04" x="-33.5" y="-201" width="67" height="402" rx="33.5" ry="33.5" fill="#2D60C1" opacity="1" transform="translate(262.25 279) rotate(0)" />
    <rect id="forma-05" x="-33.5" y="-134" width="67" height="268" rx="33.5" ry="33.5" fill="#2D60C1" opacity="1" transform="translate(523 362) rotate(35)" />
    <rect id="forma-06" x="-33.5" y="-33.5" width="67" height="67" rx="33.5" ry="33.5" fill="#3D80FD" opacity="1" transform="translate(362.75 279) rotate(0)" />
    <rect id="forma-07" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#2D60C1" opacity="1" transform="translate(161.75 647.5) rotate(0)" />
    <rect id="forma-08" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#2D60C1" opacity="1" transform="translate(262.25 647.5) rotate(0)" />
    <rect id="forma-09" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#3D80FD" opacity="1" transform="translate(362.75 647.5) rotate(0)" />
    <rect id="forma-11" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#2D60C1" opacity="1" transform="translate(463.25 647.5) rotate(0)" />
    <rect id="forma-10" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#3D80FD" opacity="1" transform="translate(415.87 627.88) rotate(45)" />
    <rect id="forma-12" x="-33.5" y="-107.2" width="67" height="214.4" rx="33.5" ry="33.5" fill="#2D60C1" opacity="1" transform="translate(639.04 645.24) rotate(-20)" />
    <rect id="forma-13" x="-33.5" y="-107.2" width="67" height="214.4" rx="33.5" ry="33.5" fill="#3D80FD" opacity="1" transform="translate(588.96 645.24) rotate(20)" />
  </g>

### 05#HMA NARRATIVE
*(Luz: \`#C5A367\` | Profundo: \`#82600A\`)*
  <g id="hma-isotype" data-service="HMA NARRATIVE">
    <rect id="forma-01" x="-33.5" y="-83.75" width="67" height="167.5" rx="33.5" ry="33.5" fill="#C5A367" opacity="1" transform="translate(413 446.5) rotate(90)" />
    <rect id="forma-02" x="-33.5" y="-134" width="67" height="268" rx="33.5" ry="33.5" fill="#C5A367" opacity="1" transform="translate(232.81 350.06) rotate(-45)" />
    <rect id="forma-03" x="-33.5" y="-134" width="67" height="268" rx="33.5" ry="33.5" fill="#C5A367" opacity="1" transform="translate(593.19 350.06) rotate(45)" />
    <rect id="forma-04" x="-33.5" y="-134" width="67" height="268" rx="33.5" ry="33.5" fill="#82600A" opacity="1" transform="translate(291.69 274.94) rotate(-45)" />
    <rect id="forma-05" x="-33.5" y="-134" width="67" height="268" rx="33.5" ry="33.5" fill="#82600A" opacity="1" transform="translate(534.31 274.94) rotate(45)" />
    <rect id="forma-06" x="-33.5" y="-33.5" width="67" height="67" rx="33.5" ry="33.5" fill="#C5A367" opacity="1" transform="translate(413 145) rotate(90)" />
    <rect id="forma-07" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#82600A" opacity="1" transform="translate(161.75 647.5) rotate(0)" />
    <rect id="forma-08" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#82600A" opacity="1" transform="translate(262.25 647.5) rotate(0)" />
    <rect id="forma-09" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#C5A367" opacity="1" transform="translate(362.75 647.5) rotate(0)" />
    <rect id="forma-11" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#82600A" opacity="1" transform="translate(463.25 647.5) rotate(0)" />
    <rect id="forma-10" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#C5A367" opacity="1" transform="translate(415.87 627.88) rotate(45)" />
    <rect id="forma-12" x="-33.5" y="-107.2" width="67" height="214.4" rx="33.5" ry="33.5" fill="#82600A" opacity="1" transform="translate(639.04 645.24) rotate(-20)" />
    <rect id="forma-13" x="-33.5" y="-107.2" width="67" height="214.4" rx="33.5" ry="33.5" fill="#C5A367" opacity="1" transform="translate(588.96 645.24) rotate(20)" />
  </g>

### 06#HMA LENSES
*(Luz: \`#052D63\` | Profundo: \`#031C3D\`)*
  <g id="hma-isotype" data-service="HMA LENSES">
    <rect id="forma-01" x="-33.5" y="-83.75" width="67" height="167.5" rx="33.5" ry="33.5" fill="#052D63" opacity="1" transform="translate(413 279) rotate(90)" />
    <rect id="forma-02" x="-33.5" y="-201" width="67" height="402" rx="33.5" ry="33.5" fill="#052D63" opacity="1" transform="translate(496.75 446.5) rotate(90)" />
    <rect id="forma-03" x="-33.5" y="-201" width="67" height="402" rx="33.5" ry="33.5" fill="#052D63" opacity="1" transform="translate(664.25 279) rotate(0)" />
    <rect id="forma-04" x="-33.5" y="-201" width="67" height="402" rx="33.5" ry="33.5" fill="#031C3D" opacity="1" transform="translate(161.75 279) rotate(0)" />
    <rect id="forma-05" x="-33.5" y="-201" width="67" height="402" rx="33.5" ry="33.5" fill="#031C3D" opacity="1" transform="translate(329.25 111.5) rotate(90)" />
    <rect id="forma-06" x="-33.5" y="-33.5" width="67" height="67" rx="33.5" ry="33.5" fill="#052D63" opacity="1" transform="translate(563.75 195.25) rotate(0)" />
    <rect id="forma-07" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#031C3D" opacity="1" transform="translate(161.75 647.5) rotate(0)" />
    <rect id="forma-08" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#031C3D" opacity="1" transform="translate(262.25 647.5) rotate(0)" />
    <rect id="forma-09" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#052D63" opacity="1" transform="translate(362.75 647.5) rotate(0)" />
    <rect id="forma-11" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#031C3D" opacity="1" transform="translate(463.25 647.5) rotate(0)" />
    <rect id="forma-10" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#052D63" opacity="1" transform="translate(415.87 627.88) rotate(45)" />
    <rect id="forma-12" x="-33.5" y="-107.2" width="67" height="214.4" rx="33.5" ry="33.5" fill="#031C3D" opacity="1" transform="translate(639.04 645.24) rotate(-20)" />
    <rect id="forma-13" x="-33.5" y="-107.2" width="67" height="214.4" rx="33.5" ry="33.5" fill="#052D63" opacity="1" transform="translate(588.96 645.24) rotate(20)" />
  </g>

### 07#HMA UNDERLINE
*(Luz: \`#D96B43\` | Profundo: \`#964222\`)*
  <g id="hma-isotype" data-service="HMA UNDERLINE">
    <rect id="forma-01" x="-33.5" y="-83.75" width="67" height="167.5" rx="33.5" ry="33.5" fill="#D96B43" opacity="1" transform="translate(664.25 161.75) rotate(0)" />
    <rect id="forma-02" x="-33.5" y="-83.75" width="67" height="167.5" rx="33.5" ry="33.5" fill="#D96B43" opacity="1" transform="translate(161.75 396.25) rotate(0)" />
    <rect id="forma-03" x="-33.5" y="-83.75" width="67" height="167.5" rx="33.5" ry="33.5" fill="#D96B43" opacity="1" transform="translate(664.25 396.25) rotate(0)" />
    <rect id="forma-04" x="-33.5" y="-83.75" width="67" height="167.5" rx="33.5" ry="33.5" fill="#964222" opacity="1" transform="translate(161.75 161.75) rotate(0)" />
    <rect id="forma-05" x="-33.5" y="-83.75" width="67" height="167.5" rx="33.5" ry="33.5" fill="#964222" opacity="1" transform="translate(413 329.25) rotate(90)" />
    <rect id="forma-06" x="-33.5" y="-33.5" width="67" height="67" rx="33.5" ry="33.5" fill="#D96B43" opacity="1" transform="translate(413 228.75) rotate(0)" />
    <rect id="forma-07" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#964222" opacity="1" transform="translate(161.75 647.5) rotate(0)" />
    <rect id="forma-08" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#964222" opacity="1" transform="translate(262.25 647.5) rotate(0)" />
    <rect id="forma-09" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#D96B43" opacity="1" transform="translate(362.75 647.5) rotate(0)" />
    <rect id="forma-11" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#964222" opacity="1" transform="translate(463.25 647.5) rotate(0)" />
    <rect id="forma-10" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#D96B43" opacity="1" transform="translate(415.87 627.88) rotate(45)" />
    <rect id="forma-12" x="-33.5" y="-107.2" width="67" height="214.4" rx="33.5" ry="33.5" fill="#964222" opacity="1" transform="translate(639.04 645.24) rotate(-20)" />
    <rect id="forma-13" x="-33.5" y="-107.2" width="67" height="214.4" rx="33.5" ry="33.5" fill="#D96B43" opacity="1" transform="translate(588.96 645.24) rotate(20)" />
  </g>

### 08#HMA MERCHANDISE
*(Luz: \`#D7BB11\` | Profundo: \`#8C7907\`)*
  <g id="hma-isotype" data-service="HMA MERCHANDISE">
    <rect id="forma-03" x="-33.5" y="-67" width="67" height="134" rx="33.5" ry="33.5" fill="#D7BB11" opacity="1" transform="translate(362.75 195.25) rotate(0)" />
    <rect id="forma-05" x="-33.5" y="-67" width="67" height="134" rx="33.5" ry="33.5" fill="#D7BB11" opacity="1" transform="translate(463.25 195.25) rotate(0)" />
    <rect id="forma-01" x="-33.5" y="-134" width="67" height="268" rx="33.5" ry="33.5" fill="#D7BB11" opacity="1" transform="translate(413 346) rotate(90)" />
    <rect id="forma-02" x="-33.5" y="-201" width="67" height="402" rx="33.5" ry="33.5" fill="#8C7907" opacity="1" transform="translate(413 245.5) rotate(90)" />
    <rect id="forma-04" x="-33.5" y="-201" width="67" height="402" rx="33.5" ry="33.5" fill="#8C7907" opacity="1" transform="translate(413 446.5) rotate(-90)" />
    <rect id="forma-06" x="-33.5" y="-33.5" width="67" height="67" rx="33.5" ry="33.5" fill="#D7BB11" opacity="1" transform="translate(413 111.5) rotate(0)" />
    <rect id="forma-07" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#8C7907" opacity="1" transform="translate(161.75 647.5) rotate(0)" />
    <rect id="forma-08" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#8C7907" opacity="1" transform="translate(262.25 647.5) rotate(0)" />
    <rect id="forma-09" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#D7BB11" opacity="1" transform="translate(362.75 647.5) rotate(0)" />
    <rect id="forma-11" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#8C7907" opacity="1" transform="translate(463.25 647.5) rotate(0)" />
    <rect id="forma-12" x="-33.5" y="-107.2" width="67" height="214.4" rx="33.5" ry="33.5" fill="#8C7907" opacity="1" transform="translate(639.04 645.24) rotate(-20)" />
    <rect id="forma-13" x="-33.5" y="-107.2" width="67" height="214.4" rx="33.5" ry="33.5" fill="#D7BB11" opacity="1" transform="translate(588.96 645.24) rotate(20)" />
    <rect id="forma-10" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#D7BB11" opacity="1" transform="translate(415.87 627.88) rotate(45)" />
  </g>

### 09#HMA EXPERIENCES
*(Luz: \`#1D5B8F\` | Profundo: \`#1B3F67\`)*
  <g id="hma-isotype" data-service="HMA EXPERIENCES">
    <rect id="forma-01" x="-33.5" y="-201" width="67" height="402" rx="33.5" ry="33.5" fill="#1D5B8F" opacity="1" transform="translate(329.25 111.5) rotate(90)" />
    <rect id="forma-02" x="-33.5" y="-201" width="67" height="402" rx="33.5" ry="33.5" fill="#1B3F67" opacity="1" transform="translate(329.25 446.5) rotate(90)" />
    <rect id="forma-03" x="-33.5" y="-201" width="67" height="402" rx="33.5" ry="33.5" fill="#1B3F67" opacity="1" transform="translate(161.75 279) rotate(0)" />
    <rect id="forma-04" x="-33.5" y="-67" width="67" height="134" rx="33.5" ry="33.5" fill="#1D5B8F" opacity="1" transform="translate(639.66 300.53) rotate(-50)" />
    <rect id="forma-05" x="-33.5" y="-67" width="67" height="134" rx="33.5" ry="33.5" fill="#1D5B8F" opacity="1" transform="translate(637.69 255.31) rotate(-135)" />
    <rect id="forma-06" x="-33.5" y="-33.5" width="67" height="67" rx="33.5" ry="33.5" fill="#1D5B8F" opacity="1" transform="translate(513.5 279) rotate(0)" />
    <rect id="forma-07" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#1B3F67" opacity="1" transform="translate(161.75 647.5) rotate(0)" />
    <rect id="forma-08" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#1B3F67" opacity="1" transform="translate(262.25 647.5) rotate(0)" />
    <rect id="forma-09" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#1D5B8F" opacity="1" transform="translate(362.75 647.5) rotate(0)" />
    <rect id="forma-11" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#1B3F67" opacity="1" transform="translate(463.25 647.5) rotate(0)" />
    <rect id="forma-10" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#1D5B8F" opacity="1" transform="translate(415.87 627.88) rotate(45)" />
    <rect id="forma-12" x="-33.5" y="-107.2" width="67" height="214.4" rx="33.5" ry="33.5" fill="#1B3F67" opacity="1" transform="translate(639.04 645.24) rotate(-20)" />
    <rect id="forma-13" x="-33.5" y="-107.2" width="67" height="214.4" rx="33.5" ry="33.5" fill="#1D5B8F" opacity="1" transform="translate(588.96 645.24) rotate(20)" />
  </g>

### 10#HMA NETWORK
*(Luz: \`#11D7B6\` | Profundo: \`#0A826E\`)*
  <g id="hma-isotype" data-service="HMA NETWORK">
    <rect id="forma-01" x="-33.5" y="-134" width="67" height="268" rx="33.5" ry="33.5" fill="#11D7B6" opacity="1" transform="translate(534.31 182.56) rotate(-45)" />
    <rect id="forma-02" x="-33.5" y="-134" width="67" height="268" rx="33.5" ry="33.5" fill="#0A826E" opacity="1" transform="translate(534.31 375.44) rotate(45)" />
    <rect id="forma-03" x="-33.5" y="-83.75" width="67" height="167.5" rx="33.5" ry="33.5" fill="#11D7B6" opacity="1" transform="translate(413 279) rotate(0)" />
    <rect id="forma-04" x="-33.5" y="-134" width="67" height="268" rx="33.5" ry="33.5" fill="#0A826E" opacity="1" transform="translate(291.69 182.56) rotate(45)" />
    <rect id="forma-05" x="-33.5" y="-134" width="67" height="268" rx="33.5" ry="33.5" fill="#11D7B6" opacity="1" transform="translate(291.69 375.44) rotate(-45)" />
    <rect id="forma-06" x="-33.5" y="-33.5" width="67" height="67" rx="33.5" ry="33.5" fill="#11D7B6" opacity="1" transform="translate(664.25 446.5) rotate(0)" />
    <rect id="forma-07" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#0A826E" opacity="1" transform="translate(161.75 647.5) rotate(0)" />
    <rect id="forma-08" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#0A826E" opacity="1" transform="translate(262.25 647.5) rotate(0)" />
    <rect id="forma-09" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#11D7B6" opacity="1" transform="translate(362.75 647.5) rotate(0)" />
    <rect id="forma-11" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#0A826E" opacity="1" transform="translate(463.25 647.5) rotate(0)" />
    <rect id="forma-10" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#11D7B6" opacity="1" transform="translate(415.87 627.88) rotate(45)" />
    <rect id="forma-12" x="-33.5" y="-107.2" width="67" height="214.4" rx="33.5" ry="33.5" fill="#0A826E" opacity="1" transform="translate(639.04 645.24) rotate(-20)" />
    <rect id="forma-13" x="-33.5" y="-107.2" width="67" height="214.4" rx="33.5" ry="33.5" fill="#11D7B6" opacity="1" transform="translate(588.96 645.24) rotate(20)" />
  </g>

### 11#HMA ALPHABETS
*(Luz: \`#AE7176\` | Profundo: \`#77454A\`)*
  <g id="hma-isotype" data-service="HMA ALPHABETS">
    <rect id="forma-01" x="-33.5" y="-134" width="67" height="268" rx="33.5" ry="33.5" fill="#77454A" opacity="1" transform="translate(378.63 222.69) rotate(20)" />
    <rect id="forma-02" x="-33.5" y="-134" width="67" height="268" rx="33.5" ry="33.5" fill="#AE7176" opacity="1" transform="translate(447.37 222.69) rotate(-20)" />
    <rect id="forma-03" x="-33.5" y="-83.75" width="67" height="167.5" rx="33.5" ry="33.5" fill="#77454A" opacity="1" transform="translate(245.5 262.25) rotate(0)" />
    <rect id="forma-04" x="-33.5" y="-201" width="67" height="402" rx="33.5" ry="33.5" fill="#77454A" opacity="1" transform="translate(413 446.5) rotate(-90)" />
    <rect id="forma-05" x="-33.5" y="-33.5" width="67" height="67" rx="33.5" ry="33.5" fill="#AE7176" opacity="1" transform="translate(580.5 312.5) rotate(90)" />
    <rect id="forma-06" x="-33.5" y="-67" width="67" height="134" rx="33.5" ry="33.5" fill="#AE7176" opacity="1" transform="translate(410 295.8) rotate(90)" />
    <rect id="forma-07" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#77454A" opacity="1" transform="translate(161.75 647.5) rotate(0)" />
    <rect id="forma-08" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#77454A" opacity="1" transform="translate(262.25 647.5) rotate(0)" />
    <rect id="forma-09" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#AE7176" opacity="1" transform="translate(362.75 647.5) rotate(0)" />
    <rect id="forma-11" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#77454A" opacity="1" transform="translate(463.25 647.5) rotate(0)" />
    <rect id="forma-10" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#AE7176" opacity="1" transform="translate(415.87 627.88) rotate(45)" />
    <rect id="forma-12" x="-33.5" y="-107.2" width="67" height="214.4" rx="33.5" ry="33.5" fill="#77454A" opacity="1" transform="translate(639.04 645.24) rotate(-20)" />
    <rect id="forma-13" x="-33.5" y="-107.2" width="67" height="214.4" rx="33.5" ry="33.5" fill="#AE7176" opacity="1" transform="translate(588.96 645.24) rotate(20)" />
  </g>

### 12#HMA ILLUSTRATIONS
*(Luz: \`#75C962\` | Profundo: \`#4B893C\`)*
  <g id="hma-isotype" data-service="HMA ILLUSTRATIONS">
    <rect id="forma-01" x="-33.5" y="-83.75" width="67" height="167.5" rx="33.5" ry="33.5" fill="#75C962" opacity="1" transform="translate(384.18 271.34) rotate(-35)" />
    <rect id="forma-02" x="-33.5" y="-201" width="67" height="402" rx="33.5" ry="33.5" fill="#75C962" opacity="1" transform="translate(161.75 279) rotate(0)" />
    <rect id="forma-03" x="-33.5" y="-201" width="67" height="402" rx="33.5" ry="33.5" fill="#75C962" opacity="1" transform="translate(664.25 279) rotate(0)" />
    <rect id="forma-04" x="-33.5" y="-134" width="67" height="268" rx="33.5" ry="33.5" fill="#4B893C" opacity="1" transform="translate(413 446.5) rotate(90)" />
    <rect id="forma-05" x="-33.5" y="-83.75" width="67" height="167.5" rx="33.5" ry="33.5" fill="#4B893C" opacity="1" transform="translate(441.82 271.34) rotate(35)" />
    <rect id="forma-06" x="-33.5" y="-33.5" width="67" height="67" rx="33.5" ry="33.5" fill="#75C962" opacity="1" transform="translate(547 145) rotate(0)" />
    <rect id="forma-07" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#4B893C" opacity="1" transform="translate(161.75 647.5) rotate(0)" />
    <rect id="forma-08" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#4B893C" opacity="1" transform="translate(262.25 647.5) rotate(0)" />
    <rect id="forma-09" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#75C962" opacity="1" transform="translate(362.75 647.5) rotate(0)" />
    <rect id="forma-11" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#4B893C" opacity="1" transform="translate(463.25 647.5) rotate(0)" />
    <rect id="forma-10" x="-33.5" y="-100.5" width="67" height="201" rx="33.5" ry="33.5" fill="#75C962" opacity="1" transform="translate(415.87 627.88) rotate(45)" />
    <rect id="forma-12" x="-33.5" y="-107.2" width="67" height="214.4" rx="33.5" ry="33.5" fill="#4B893C" opacity="1" transform="translate(639.04 645.24) rotate(-20)" />
    <rect id="forma-13" x="-33.5" y="-107.2" width="67" height="214.4" rx="33.5" ry="33.5" fill="#75C962" opacity="1" transform="translate(588.96 645.24) rotate(20)" />
  </g>
`;

const templates = [];

const sections = rawSvgData.split(/### \d{2}#/);

sections.forEach((section, index) => {
  if (!section.trim()) return;

  const lines = section.split('\n');
  const titleLine = lines[0].trim();
  const name = index === 1 ? "HMA MASTER (DIAGONAL)" : titleLine; // First item is after the first split

  // Second pass with fixed indices
  const actualRects = [];
  const rectRegex2 = /<rect id="([^"]+)"[^>]+width="([^"]+)" height="([^"]+)"[^>]+fill="([^"]+)"[^>]+transform="translate\(([^ ]+) ([^)]+)\) rotate\(([^)]+)\)"/g;
  
  let match2;
  while ((match2 = rectRegex2.exec(section)) !== null) {
    const originalId = match2[1];
    const width = parseFloat(match2[2]);
    const height = parseFloat(match2[3]);
    const color = match2[4];
    const cx = parseFloat(match2[5]);
    const cy = parseFloat(match2[6]);
    const rot = parseFloat(match2[7]);

    actualRects.push({
      id: `shape-${originalId}`,
      x: cx - width / 2,
      y: cy - height / 2,
      widthX: width / 67,
      heightX: height / 67,
      rot: rot,
      color: color,
      wireframe: false,
      hidden: false,
      locked: false
    });
  }

  if (actualRects.length > 0) {
    templates.push({
      name: name,
      shapes: actualRects
    });
  }
});

const tsCode = `import { MatrixShape } from '../types/matrix';

export interface MatrixTemplate {
  name: string;
  shapes: MatrixShape[];
}

export const MATRIX_TEMPLATES: MatrixTemplate[] = ${JSON.stringify(templates, null, 2)};
`;

fs.writeFileSync('src/data/matrixTemplates.ts', tsCode);
