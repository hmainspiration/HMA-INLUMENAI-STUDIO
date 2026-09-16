import { HMAPiece, HMAPreset } from "../types/hma";
import { LogoData } from "../types";

const TARGET_CENTER = 540;
const SOURCE_CENTER = 413;
const UNIT_M = 67;

export function to1080(val: number) {
  return TARGET_CENTER + (val - SOURCE_CENTER);
}

export const INITIAL_DATA: LogoData[] = [
  
  {
    serviceId: "hma-master-diagonal",
    serviceName: "HMA MASTER (DIAGONAL)",
    clusterName: "Oficial",
    luzColor: "#3D80FD",
    profundoColor: "#2D60C1",
    shapes: [
      {
        id: "forma-08",
        length: 402,
        width: 67,
        x: to1080(152.43),
        y: to1080(389.31),
        rotation: 45,
        color: "#3D80FD"
      },
      {
        id: "forma-06",
        length: 67,
        width: 67,
        x: to1080(484.07),
        y: to1080(484.07),
        rotation: -45,
        color: "#3D80FD"
      },
      {
        id: "forma-07",
        length: 402,
        width: 67,
        x: to1080(389.31),
        y: to1080(673.57),
        rotation: -45,
        color: "#3D80FD"
      },
      {
        id: "forma-09",
        length: 402,
        width: 67,
        x: to1080(673.57),
        y: to1080(436.69),
        rotation: 45,
        color: "#2D60C1"
      },
      {
        id: "forma-10",
        length: 268,
        width: 67,
        x: to1080(270.87),
        y: to1080(413.01),
        rotation: 45,
        color: "#2D60C1"
      },
      {
        id: "forma-11",
        length: 268,
        width: 67,
        x: to1080(412.99),
        y: to1080(270.87),
        rotation: -45,
        color: "#3D80FD"
      },
      {
        id: "forma-12",
        length: 268,
        width: 67,
        x: to1080(413.01),
        y: to1080(555.13),
        rotation: -45,
        color: "#2D60C1"
      },
      {
        id: "forma-13",
        length: 402,
        width: 67,
        x: to1080(436.69),
        y: to1080(152.43),
        rotation: -45,
        color: "#2D60C1"
      },
      {
        id: "forma-03",
        length: 167.5,
        width: 67,
        x: to1080(293.4),
        y: to1080(354.95),
        rotation: -105,
        color: "#3D80FD"
      },
      {
        id: "forma-05",
        length: 167.5,
        width: 67,
        x: to1080(257.86),
        y: to1080(319.42),
        rotation: 15,
        color: "#2D60C1"
      },
      {
        id: "forma-01",
        length: 167.5,
        width: 67,
        x: to1080(448.53),
        y: to1080(235.34),
        rotation: 45,
        color: "#3D80FD"
      },
      {
        id: "forma-04",
        length: 167.5,
        width: 67,
        x: to1080(306.41),
        y: to1080(519.6),
        rotation: 45,
        color: "#2D60C1"
      },
      {
        id: "forma-02",
        length: 167.5,
        width: 67,
        x: to1080(377.47),
        y: to1080(590.66),
        rotation: 45,
        color: "#3D80FD"
      }
    ]
  },

  {
    serviceId: "hma-heritage",
    serviceName: "HMA HERITAGE",
    clusterName: "Oficial",
    luzColor: "#315629",
    profundoColor: "#1B3315",
    shapes: [
      {
        id: "forma-01",
        length: 402,
        width: 67,
        x: to1080(379.5),
        y: to1080(279),
        rotation: 90,
        color: "#315629"
      },
      {
        id: "forma-02",
        length: 167.5,
        width: 67,
        x: to1080(279),
        y: to1080(195.25),
        rotation: 180,
        color: "#315629"
      },
      {
        id: "forma-03",
        length: 167.5,
        width: 67,
        x: to1080(413),
        y: to1080(362.75),
        rotation: 0,
        color: "#315629"
      },
      {
        id: "forma-04",
        length: 268,
        width: 67,
        x: to1080(262.25),
        y: to1080(111.5),
        rotation: -90,
        color: "#1B3315"
      },
      {
        id: "forma-05",
        length: 402,
        width: 67,
        x: to1080(496.75),
        y: to1080(446.5),
        rotation: 90,
        color: "#1B3315"
      },
      {
        id: "forma-06",
        length: 67,
        width: 67,
        x: to1080(580.5),
        y: to1080(111.5),
        rotation: 0,
        color: "#315629"
      },
      {
        id: "forma-07",
        length: 201,
        width: 67,
        x: to1080(161.75),
        y: to1080(647.5),
        rotation: 0,
        color: "#1B3315"
      },
      {
        id: "forma-08",
        length: 201,
        width: 67,
        x: to1080(262.25),
        y: to1080(647.5),
        rotation: 0,
        color: "#1B3315"
      },
      {
        id: "forma-09",
        length: 201,
        width: 67,
        x: to1080(362.75),
        y: to1080(647.5),
        rotation: 0,
        color: "#315629"
      },
      {
        id: "forma-11",
        length: 201,
        width: 67,
        x: to1080(463.25),
        y: to1080(647.5),
        rotation: 0,
        color: "#1B3315"
      },
      {
        id: "forma-10",
        length: 201,
        width: 67,
        x: to1080(415.87),
        y: to1080(627.88),
        rotation: 45,
        color: "#315629"
      },
      {
        id: "forma-12",
        length: 214.4,
        width: 67,
        x: to1080(639.04),
        y: to1080(645.24),
        rotation: -20,
        color: "#1B3315"
      },
      {
        id: "forma-13",
        length: 214.4,
        width: 67,
        x: to1080(588.96),
        y: to1080(645.24),
        rotation: 20,
        color: "#315629"
      }
    ]
  },

  {
    serviceId: "hma-melody",
    serviceName: "HMA MELODY",
    clusterName: "Oficial",
    luzColor: "#108591",
    profundoColor: "#074349",
    shapes: [
      {
        id: "forma-01",
        length: 402,
        width: 67,
        x: to1080(362.75),
        y: to1080(279),
        rotation: 0,
        color: "#108591"
      },
      {
        id: "forma-02",
        length: 268,
        width: 67,
        x: to1080(463.25),
        y: to1080(346),
        rotation: 0,
        color: "#074349"
      },
      {
        id: "forma-03",
        length: 268,
        width: 67,
        x: to1080(262.25),
        y: to1080(346),
        rotation: 0,
        color: "#108591"
      },
      {
        id: "forma-04",
        length: 167.5,
        width: 67,
        x: to1080(161.75),
        y: to1080(396.25),
        rotation: 0,
        color: "#074349"
      },
      {
        id: "forma-05",
        length: 134,
        width: 67,
        x: to1080(563.75),
        y: to1080(413),
        rotation: 0,
        color: "#108591"
      },
      {
        id: "forma-06",
        length: 67,
        width: 67,
        x: to1080(664.25),
        y: to1080(446.5),
        rotation: 0,
        color: "#108591"
      },
      {
        id: "forma-07",
        length: 201,
        width: 67,
        x: to1080(161.75),
        y: to1080(647.5),
        rotation: 0,
        color: "#074349"
      },
      {
        id: "forma-08",
        length: 201,
        width: 67,
        x: to1080(262.25),
        y: to1080(647.5),
        rotation: 0,
        color: "#074349"
      },
      {
        id: "forma-09",
        length: 201,
        width: 67,
        x: to1080(362.75),
        y: to1080(647.5),
        rotation: 0,
        color: "#108591"
      },
      {
        id: "forma-11",
        length: 201,
        width: 67,
        x: to1080(463.25),
        y: to1080(647.5),
        rotation: 0,
        color: "#074349"
      },
      {
        id: "forma-10",
        length: 201,
        width: 67,
        x: to1080(415.87),
        y: to1080(627.88),
        rotation: 45,
        color: "#108591"
      },
      {
        id: "forma-12",
        length: 214.4,
        width: 67,
        x: to1080(639.04),
        y: to1080(645.24),
        rotation: -20,
        color: "#074349"
      },
      {
        id: "forma-13",
        length: 214.4,
        width: 67,
        x: to1080(588.96),
        y: to1080(645.24),
        rotation: 20,
        color: "#108591"
      }
    ]
  },

  {
    serviceId: "hma-architecture",
    serviceName: "HMA ARCHITECTURE",
    clusterName: "Oficial",
    luzColor: "#7D77B0",
    profundoColor: "#514B7D",
    shapes: [
      {
        id: "forma-01",
        length: 268,
        width: 67,
        x: to1080(413),
        y: to1080(346),
        rotation: 90,
        color: "#7D77B0"
      },
      {
        id: "forma-02",
        length: 167.5,
        width: 67,
        x: to1080(212),
        y: to1080(446.5),
        rotation: -90,
        color: "#7D77B0"
      },
      {
        id: "forma-03",
        length: 167.5,
        width: 67,
        x: to1080(614),
        y: to1080(446.5),
        rotation: 90,
        color: "#7D77B0"
      },
      {
        id: "forma-04",
        length: 268,
        width: 67,
        x: to1080(413),
        y: to1080(446.5),
        rotation: 90,
        color: "#514B7D"
      },
      {
        id: "forma-05",
        length: 167.5,
        width: 67,
        x: to1080(413),
        y: to1080(195.25),
        rotation: 0,
        color: "#514B7D"
      },
      {
        id: "forma-06",
        length: 67,
        width: 67,
        x: to1080(413),
        y: to1080(94.75),
        rotation: 0,
        color: "#7D77B0"
      },
      {
        id: "forma-07",
        length: 201,
        width: 67,
        x: to1080(161.75),
        y: to1080(647.5),
        rotation: 0,
        color: "#514B7D"
      },
      {
        id: "forma-08",
        length: 201,
        width: 67,
        x: to1080(262.25),
        y: to1080(647.5),
        rotation: 0,
        color: "#514B7D"
      },
      {
        id: "forma-09",
        length: 201,
        width: 67,
        x: to1080(362.75),
        y: to1080(647.5),
        rotation: 0,
        color: "#7D77B0"
      },
      {
        id: "forma-11",
        length: 201,
        width: 67,
        x: to1080(463.25),
        y: to1080(647.5),
        rotation: 0,
        color: "#514B7D"
      },
      {
        id: "forma-10",
        length: 201,
        width: 67,
        x: to1080(415.87),
        y: to1080(627.88),
        rotation: 45,
        color: "#7D77B0"
      },
      {
        id: "forma-12",
        length: 214.4,
        width: 67,
        x: to1080(639.04),
        y: to1080(645.24),
        rotation: -20,
        color: "#514B7D"
      },
      {
        id: "forma-13",
        length: 214.4,
        width: 67,
        x: to1080(588.96),
        y: to1080(645.24),
        rotation: 20,
        color: "#7D77B0"
      }
    ]
  },

  {
    serviceId: "hma-imagination",
    serviceName: "HMA IMAGINATION",
    clusterName: "Oficial",
    luzColor: "#3D80FD",
    profundoColor: "#2D60C1",
    shapes: [
      {
        id: "forma-01",
        length: 268,
        width: 67,
        x: to1080(522.75),
        y: to1080(197.25),
        rotation: -35,
        color: "#3D80FD"
      },
      {
        id: "forma-02",
        length: 134,
        width: 67,
        x: to1080(362.75),
        y: to1080(413),
        rotation: 0,
        color: "#3D80FD"
      },
      {
        id: "forma-03",
        length: 134,
        width: 67,
        x: to1080(362.75),
        y: to1080(145),
        rotation: 0,
        color: "#3D80FD"
      },
      {
        id: "forma-04",
        length: 402,
        width: 67,
        x: to1080(262.25),
        y: to1080(279),
        rotation: 0,
        color: "#2D60C1"
      },
      {
        id: "forma-05",
        length: 268,
        width: 67,
        x: to1080(523),
        y: to1080(362),
        rotation: 35,
        color: "#2D60C1"
      },
      {
        id: "forma-06",
        length: 67,
        width: 67,
        x: to1080(362.75),
        y: to1080(279),
        rotation: 0,
        color: "#3D80FD"
      },
      {
        id: "forma-07",
        length: 201,
        width: 67,
        x: to1080(161.75),
        y: to1080(647.5),
        rotation: 0,
        color: "#2D60C1"
      },
      {
        id: "forma-08",
        length: 201,
        width: 67,
        x: to1080(262.25),
        y: to1080(647.5),
        rotation: 0,
        color: "#2D60C1"
      },
      {
        id: "forma-09",
        length: 201,
        width: 67,
        x: to1080(362.75),
        y: to1080(647.5),
        rotation: 0,
        color: "#3D80FD"
      },
      {
        id: "forma-11",
        length: 201,
        width: 67,
        x: to1080(463.25),
        y: to1080(647.5),
        rotation: 0,
        color: "#2D60C1"
      },
      {
        id: "forma-10",
        length: 201,
        width: 67,
        x: to1080(415.87),
        y: to1080(627.88),
        rotation: 45,
        color: "#3D80FD"
      },
      {
        id: "forma-12",
        length: 214.4,
        width: 67,
        x: to1080(639.04),
        y: to1080(645.24),
        rotation: -20,
        color: "#2D60C1"
      },
      {
        id: "forma-13",
        length: 214.4,
        width: 67,
        x: to1080(588.96),
        y: to1080(645.24),
        rotation: 20,
        color: "#3D80FD"
      }
    ]
  },

  {
    serviceId: "hma-narrative",
    serviceName: "HMA NARRATIVES",
    clusterName: "Oficial",
    luzColor: "#C5A367",
    profundoColor: "#82600A",
    shapes: [
      {
        id: "forma-01",
        length: 167.5,
        width: 67,
        x: to1080(413),
        y: to1080(446.5),
        rotation: 90,
        color: "#C5A367"
      },
      {
        id: "forma-02",
        length: 268,
        width: 67,
        x: to1080(232.81),
        y: to1080(350.06),
        rotation: -45,
        color: "#C5A367"
      },
      {
        id: "forma-03",
        length: 268,
        width: 67,
        x: to1080(593.19),
        y: to1080(350.06),
        rotation: 45,
        color: "#C5A367"
      },
      {
        id: "forma-04",
        length: 268,
        width: 67,
        x: to1080(291.69),
        y: to1080(274.94),
        rotation: -45,
        color: "#82600A"
      },
      {
        id: "forma-05",
        length: 268,
        width: 67,
        x: to1080(534.31),
        y: to1080(274.94),
        rotation: 45,
        color: "#82600A"
      },
      {
        id: "forma-06",
        length: 67,
        width: 67,
        x: to1080(413),
        y: to1080(145),
        rotation: 90,
        color: "#C5A367"
      },
      {
        id: "forma-07",
        length: 201,
        width: 67,
        x: to1080(161.75),
        y: to1080(647.5),
        rotation: 0,
        color: "#82600A"
      },
      {
        id: "forma-08",
        length: 201,
        width: 67,
        x: to1080(262.25),
        y: to1080(647.5),
        rotation: 0,
        color: "#82600A"
      },
      {
        id: "forma-09",
        length: 201,
        width: 67,
        x: to1080(362.75),
        y: to1080(647.5),
        rotation: 0,
        color: "#C5A367"
      },
      {
        id: "forma-11",
        length: 201,
        width: 67,
        x: to1080(463.25),
        y: to1080(647.5),
        rotation: 0,
        color: "#82600A"
      },
      {
        id: "forma-10",
        length: 201,
        width: 67,
        x: to1080(415.87),
        y: to1080(627.88),
        rotation: 45,
        color: "#C5A367"
      },
      {
        id: "forma-12",
        length: 214.4,
        width: 67,
        x: to1080(639.04),
        y: to1080(645.24),
        rotation: -20,
        color: "#82600A"
      },
      {
        id: "forma-13",
        length: 214.4,
        width: 67,
        x: to1080(588.96),
        y: to1080(645.24),
        rotation: 20,
        color: "#C5A367"
      }
    ]
  },

  {
    serviceId: "hma-lenses",
    serviceName: "HMA LENSES",
    clusterName: "Oficial",
    luzColor: "#052D63",
    profundoColor: "#031C3D",
    shapes: [
      {
        id: "forma-01",
        length: 167.5,
        width: 67,
        x: to1080(413),
        y: to1080(279),
        rotation: 90,
        color: "#052D63"
      },
      {
        id: "forma-02",
        length: 402,
        width: 67,
        x: to1080(496.75),
        y: to1080(446.5),
        rotation: 90,
        color: "#052D63"
      },
      {
        id: "forma-03",
        length: 402,
        width: 67,
        x: to1080(664.25),
        y: to1080(279),
        rotation: 0,
        color: "#052D63"
      },
      {
        id: "forma-04",
        length: 402,
        width: 67,
        x: to1080(161.75),
        y: to1080(279),
        rotation: 0,
        color: "#031C3D"
      },
      {
        id: "forma-05",
        length: 402,
        width: 67,
        x: to1080(329.25),
        y: to1080(111.5),
        rotation: 90,
        color: "#031C3D"
      },
      {
        id: "forma-06",
        length: 67,
        width: 67,
        x: to1080(563.75),
        y: to1080(195.25),
        rotation: 0,
        color: "#052D63"
      },
      {
        id: "forma-07",
        length: 201,
        width: 67,
        x: to1080(161.75),
        y: to1080(647.5),
        rotation: 0,
        color: "#031C3D"
      },
      {
        id: "forma-08",
        length: 201,
        width: 67,
        x: to1080(262.25),
        y: to1080(647.5),
        rotation: 0,
        color: "#031C3D"
      },
      {
        id: "forma-09",
        length: 201,
        width: 67,
        x: to1080(362.75),
        y: to1080(647.5),
        rotation: 0,
        color: "#052D63"
      },
      {
        id: "forma-11",
        length: 201,
        width: 67,
        x: to1080(463.25),
        y: to1080(647.5),
        rotation: 0,
        color: "#031C3D"
      },
      {
        id: "forma-10",
        length: 201,
        width: 67,
        x: to1080(415.87),
        y: to1080(627.88),
        rotation: 45,
        color: "#052D63"
      },
      {
        id: "forma-12",
        length: 214.4,
        width: 67,
        x: to1080(639.04),
        y: to1080(645.24),
        rotation: -20,
        color: "#031C3D"
      },
      {
        id: "forma-13",
        length: 214.4,
        width: 67,
        x: to1080(588.96),
        y: to1080(645.24),
        rotation: 20,
        color: "#052D63"
      }
    ]
  },

  {
    serviceId: "hma-underline",
    serviceName: "HMA UNDERLINE",
    clusterName: "Oficial",
    luzColor: "#D96B43",
    profundoColor: "#964222",
    shapes: [
      {
        id: "forma-01",
        length: 167.5,
        width: 67,
        x: to1080(664.25),
        y: to1080(161.75),
        rotation: 0,
        color: "#D96B43"
      },
      {
        id: "forma-02",
        length: 167.5,
        width: 67,
        x: to1080(161.75),
        y: to1080(396.25),
        rotation: 0,
        color: "#D96B43"
      },
      {
        id: "forma-03",
        length: 167.5,
        width: 67,
        x: to1080(664.25),
        y: to1080(396.25),
        rotation: 0,
        color: "#D96B43"
      },
      {
        id: "forma-04",
        length: 167.5,
        width: 67,
        x: to1080(161.75),
        y: to1080(161.75),
        rotation: 0,
        color: "#964222"
      },
      {
        id: "forma-05",
        length: 167.5,
        width: 67,
        x: to1080(413),
        y: to1080(329.25),
        rotation: 90,
        color: "#964222"
      },
      {
        id: "forma-06",
        length: 67,
        width: 67,
        x: to1080(413),
        y: to1080(228.75),
        rotation: 0,
        color: "#D96B43"
      },
      {
        id: "forma-07",
        length: 201,
        width: 67,
        x: to1080(161.75),
        y: to1080(647.5),
        rotation: 0,
        color: "#964222"
      },
      {
        id: "forma-08",
        length: 201,
        width: 67,
        x: to1080(262.25),
        y: to1080(647.5),
        rotation: 0,
        color: "#964222"
      },
      {
        id: "forma-09",
        length: 201,
        width: 67,
        x: to1080(362.75),
        y: to1080(647.5),
        rotation: 0,
        color: "#D96B43"
      },
      {
        id: "forma-11",
        length: 201,
        width: 67,
        x: to1080(463.25),
        y: to1080(647.5),
        rotation: 0,
        color: "#964222"
      },
      {
        id: "forma-10",
        length: 201,
        width: 67,
        x: to1080(415.87),
        y: to1080(627.88),
        rotation: 45,
        color: "#D96B43"
      },
      {
        id: "forma-12",
        length: 214.4,
        width: 67,
        x: to1080(639.04),
        y: to1080(645.24),
        rotation: -20,
        color: "#964222"
      },
      {
        id: "forma-13",
        length: 214.4,
        width: 67,
        x: to1080(588.96),
        y: to1080(645.24),
        rotation: 20,
        color: "#D96B43"
      }
    ]
  },

  {
    serviceId: "hma-merchandise",
    serviceName: "HMA MERCHANDISE",
    clusterName: "Oficial",
    luzColor: "#D7BB11",
    profundoColor: "#8C7907",
    shapes: [
      {
        id: "forma-03",
        length: 134,
        width: 67,
        x: to1080(362.75),
        y: to1080(195.25),
        rotation: 0,
        color: "#D7BB11"
      },
      {
        id: "forma-05",
        length: 134,
        width: 67,
        x: to1080(463.25),
        y: to1080(195.25),
        rotation: 0,
        color: "#D7BB11"
      },
      {
        id: "forma-01",
        length: 268,
        width: 67,
        x: to1080(413),
        y: to1080(346),
        rotation: 90,
        color: "#D7BB11"
      },
      {
        id: "forma-02",
        length: 402,
        width: 67,
        x: to1080(413),
        y: to1080(245.5),
        rotation: 90,
        color: "#8C7907"
      },
      {
        id: "forma-04",
        length: 402,
        width: 67,
        x: to1080(413),
        y: to1080(446.5),
        rotation: -90,
        color: "#8C7907"
      },
      {
        id: "forma-06",
        length: 67,
        width: 67,
        x: to1080(413),
        y: to1080(111.5),
        rotation: 0,
        color: "#D7BB11"
      },
      {
        id: "forma-07",
        length: 201,
        width: 67,
        x: to1080(161.75),
        y: to1080(647.5),
        rotation: 0,
        color: "#8C7907"
      },
      {
        id: "forma-08",
        length: 201,
        width: 67,
        x: to1080(262.25),
        y: to1080(647.5),
        rotation: 0,
        color: "#8C7907"
      },
      {
        id: "forma-09",
        length: 201,
        width: 67,
        x: to1080(362.75),
        y: to1080(647.5),
        rotation: 0,
        color: "#D7BB11"
      },
      {
        id: "forma-11",
        length: 201,
        width: 67,
        x: to1080(463.25),
        y: to1080(647.5),
        rotation: 0,
        color: "#8C7907"
      },
      {
        id: "forma-12",
        length: 214.4,
        width: 67,
        x: to1080(639.04),
        y: to1080(645.24),
        rotation: -20,
        color: "#8C7907"
      },
      {
        id: "forma-13",
        length: 214.4,
        width: 67,
        x: to1080(588.96),
        y: to1080(645.24),
        rotation: 20,
        color: "#D7BB11"
      },
      {
        id: "forma-10",
        length: 201,
        width: 67,
        x: to1080(415.87),
        y: to1080(627.88),
        rotation: 45,
        color: "#D7BB11"
      }
    ]
  },

  {
    serviceId: "hma-experiences",
    serviceName: "HMA EXPERIENCES",
    clusterName: "Oficial",
    luzColor: "#1D5B8F",
    profundoColor: "#1B3F67",
    shapes: [
      {
        id: "forma-01",
        length: 402,
        width: 67,
        x: to1080(329.25),
        y: to1080(111.5),
        rotation: 90,
        color: "#1D5B8F"
      },
      {
        id: "forma-02",
        length: 402,
        width: 67,
        x: to1080(329.25),
        y: to1080(446.5),
        rotation: 90,
        color: "#1B3F67"
      },
      {
        id: "forma-03",
        length: 402,
        width: 67,
        x: to1080(161.75),
        y: to1080(279),
        rotation: 0,
        color: "#1B3F67"
      },
      {
        id: "forma-04",
        length: 134,
        width: 67,
        x: to1080(639.66),
        y: to1080(300.53),
        rotation: -50,
        color: "#1D5B8F"
      },
      {
        id: "forma-05",
        length: 134,
        width: 67,
        x: to1080(637.69),
        y: to1080(255.31),
        rotation: -135,
        color: "#1D5B8F"
      },
      {
        id: "forma-06",
        length: 67,
        width: 67,
        x: to1080(513.5),
        y: to1080(279),
        rotation: 0,
        color: "#1D5B8F"
      },
      {
        id: "forma-07",
        length: 201,
        width: 67,
        x: to1080(161.75),
        y: to1080(647.5),
        rotation: 0,
        color: "#1B3F67"
      },
      {
        id: "forma-08",
        length: 201,
        width: 67,
        x: to1080(262.25),
        y: to1080(647.5),
        rotation: 0,
        color: "#1B3F67"
      },
      {
        id: "forma-09",
        length: 201,
        width: 67,
        x: to1080(362.75),
        y: to1080(647.5),
        rotation: 0,
        color: "#1D5B8F"
      },
      {
        id: "forma-11",
        length: 201,
        width: 67,
        x: to1080(463.25),
        y: to1080(647.5),
        rotation: 0,
        color: "#1B3F67"
      },
      {
        id: "forma-10",
        length: 201,
        width: 67,
        x: to1080(415.87),
        y: to1080(627.88),
        rotation: 45,
        color: "#1D5B8F"
      },
      {
        id: "forma-12",
        length: 214.4,
        width: 67,
        x: to1080(639.04),
        y: to1080(645.24),
        rotation: -20,
        color: "#1B3F67"
      },
      {
        id: "forma-13",
        length: 214.4,
        width: 67,
        x: to1080(588.96),
        y: to1080(645.24),
        rotation: 20,
        color: "#1D5B8F"
      }
    ]
  },

  {
    serviceId: "hma-network",
    serviceName: "HMA NETWORK",
    clusterName: "Oficial",
    luzColor: "#11D7B6",
    profundoColor: "#0A826E",
    shapes: [
      {
        id: "forma-01",
        length: 268,
        width: 67,
        x: to1080(534.31),
        y: to1080(182.56),
        rotation: -45,
        color: "#11D7B6"
      },
      {
        id: "forma-02",
        length: 268,
        width: 67,
        x: to1080(534.31),
        y: to1080(375.44),
        rotation: 45,
        color: "#0A826E"
      },
      {
        id: "forma-03",
        length: 167.5,
        width: 67,
        x: to1080(413),
        y: to1080(279),
        rotation: 0,
        color: "#11D7B6"
      },
      {
        id: "forma-04",
        length: 268,
        width: 67,
        x: to1080(291.69),
        y: to1080(182.56),
        rotation: 45,
        color: "#0A826E"
      },
      {
        id: "forma-05",
        length: 268,
        width: 67,
        x: to1080(291.69),
        y: to1080(375.44),
        rotation: -45,
        color: "#11D7B6"
      },
      {
        id: "forma-06",
        length: 67,
        width: 67,
        x: to1080(664.25),
        y: to1080(446.5),
        rotation: 0,
        color: "#11D7B6"
      },
      {
        id: "forma-07",
        length: 201,
        width: 67,
        x: to1080(161.75),
        y: to1080(647.5),
        rotation: 0,
        color: "#0A826E"
      },
      {
        id: "forma-08",
        length: 201,
        width: 67,
        x: to1080(262.25),
        y: to1080(647.5),
        rotation: 0,
        color: "#0A826E"
      },
      {
        id: "forma-09",
        length: 201,
        width: 67,
        x: to1080(362.75),
        y: to1080(647.5),
        rotation: 0,
        color: "#11D7B6"
      },
      {
        id: "forma-11",
        length: 201,
        width: 67,
        x: to1080(463.25),
        y: to1080(647.5),
        rotation: 0,
        color: "#0A826E"
      },
      {
        id: "forma-10",
        length: 201,
        width: 67,
        x: to1080(415.87),
        y: to1080(627.88),
        rotation: 45,
        color: "#11D7B6"
      },
      {
        id: "forma-12",
        length: 214.4,
        width: 67,
        x: to1080(639.04),
        y: to1080(645.24),
        rotation: -20,
        color: "#0A826E"
      },
      {
        id: "forma-13",
        length: 214.4,
        width: 67,
        x: to1080(588.96),
        y: to1080(645.24),
        rotation: 20,
        color: "#11D7B6"
      }
    ]
  },

  {
    serviceId: "hma-alphabets",
    serviceName: "HMA ALPHABETS",
    clusterName: "Oficial",
    luzColor: "#AE7176",
    profundoColor: "#77454A",
    shapes: [
      {
        id: "forma-01",
        length: 268,
        width: 67,
        x: to1080(378.63),
        y: to1080(222.69),
        rotation: 20,
        color: "#77454A"
      },
      {
        id: "forma-02",
        length: 268,
        width: 67,
        x: to1080(447.37),
        y: to1080(222.69),
        rotation: -20,
        color: "#AE7176"
      },
      {
        id: "forma-03",
        length: 167.5,
        width: 67,
        x: to1080(245.5),
        y: to1080(262.25),
        rotation: 0,
        color: "#77454A"
      },
      {
        id: "forma-04",
        length: 402,
        width: 67,
        x: to1080(413),
        y: to1080(446.5),
        rotation: -90,
        color: "#77454A"
      },
      {
        id: "forma-05",
        length: 67,
        width: 67,
        x: to1080(580.5),
        y: to1080(312.5),
        rotation: 90,
        color: "#AE7176"
      },
      {
        id: "forma-06",
        length: 134,
        width: 67,
        x: to1080(410),
        y: to1080(295.8),
        rotation: 90,
        color: "#AE7176"
      },
      {
        id: "forma-07",
        length: 201,
        width: 67,
        x: to1080(161.75),
        y: to1080(647.5),
        rotation: 0,
        color: "#77454A"
      },
      {
        id: "forma-08",
        length: 201,
        width: 67,
        x: to1080(262.25),
        y: to1080(647.5),
        rotation: 0,
        color: "#77454A"
      },
      {
        id: "forma-09",
        length: 201,
        width: 67,
        x: to1080(362.75),
        y: to1080(647.5),
        rotation: 0,
        color: "#AE7176"
      },
      {
        id: "forma-11",
        length: 201,
        width: 67,
        x: to1080(463.25),
        y: to1080(647.5),
        rotation: 0,
        color: "#77454A"
      },
      {
        id: "forma-10",
        length: 201,
        width: 67,
        x: to1080(415.87),
        y: to1080(627.88),
        rotation: 45,
        color: "#AE7176"
      },
      {
        id: "forma-12",
        length: 214.4,
        width: 67,
        x: to1080(639.04),
        y: to1080(645.24),
        rotation: -20,
        color: "#77454A"
      },
      {
        id: "forma-13",
        length: 214.4,
        width: 67,
        x: to1080(588.96),
        y: to1080(645.24),
        rotation: 20,
        color: "#AE7176"
      }
    ]
  },

  {
    serviceId: "hma-illustrations",
    serviceName: "HMA ILLUSTRATIONS",
    clusterName: "Oficial",
    luzColor: "#75C962",
    profundoColor: "#4B893C",
    shapes: [
      {
        id: "forma-01",
        length: 167.5,
        width: 67,
        x: to1080(384.18),
        y: to1080(271.34),
        rotation: -35,
        color: "#75C962"
      },
      {
        id: "forma-02",
        length: 402,
        width: 67,
        x: to1080(161.75),
        y: to1080(279),
        rotation: 0,
        color: "#75C962"
      },
      {
        id: "forma-03",
        length: 402,
        width: 67,
        x: to1080(664.25),
        y: to1080(279),
        rotation: 0,
        color: "#75C962"
      },
      {
        id: "forma-04",
        length: 268,
        width: 67,
        x: to1080(413),
        y: to1080(446.5),
        rotation: 90,
        color: "#4B893C"
      },
      {
        id: "forma-05",
        length: 167.5,
        width: 67,
        x: to1080(441.82),
        y: to1080(271.34),
        rotation: 35,
        color: "#4B893C"
      },
      {
        id: "forma-06",
        length: 67,
        width: 67,
        x: to1080(547),
        y: to1080(145),
        rotation: 0,
        color: "#75C962"
      },
      {
        id: "forma-07",
        length: 201,
        width: 67,
        x: to1080(161.75),
        y: to1080(647.5),
        rotation: 0,
        color: "#4B893C"
      },
      {
        id: "forma-08",
        length: 201,
        width: 67,
        x: to1080(262.25),
        y: to1080(647.5),
        rotation: 0,
        color: "#4B893C"
      },
      {
        id: "forma-09",
        length: 201,
        width: 67,
        x: to1080(362.75),
        y: to1080(647.5),
        rotation: 0,
        color: "#75C962"
      },
      {
        id: "forma-11",
        length: 201,
        width: 67,
        x: to1080(463.25),
        y: to1080(647.5),
        rotation: 0,
        color: "#4B893C"
      },
      {
        id: "forma-10",
        length: 201,
        width: 67,
        x: to1080(415.87),
        y: to1080(627.88),
        rotation: 45,
        color: "#75C962"
      },
      {
        id: "forma-12",
        length: 214.4,
        width: 67,
        x: to1080(639.04),
        y: to1080(645.24),
        rotation: -20,
        color: "#4B893C"
      },
      {
        id: "forma-13",
        length: 214.4,
        width: 67,
        x: to1080(588.96),
        y: to1080(645.24),
        rotation: 20,
        color: "#75C962"
      }
    ]
  }
];

export const ALL_DATA: LogoData[] = INITIAL_DATA;
