// theme.ts
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        Cgreen: { value: "#d7ea86" },
        Cbutton: { value: "#7a9f8a" },
        Dgreen: { value: "#E5F1EC" },
        TrafficGreen: { value: "#61CA43" },
        TrafficYellow: { value: "#F2BB2A" },
        TrafficRed: { value: "#E85C54" },
        DarkGreen: {value: "#3B5545"}
      },
    },
  },
});

const system = createSystem(defaultConfig, config);
export { system, config };
