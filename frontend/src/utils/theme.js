import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  fonts: {
    heading: "Inter",
    body: "Inter",
  },
  colors: {
    transparent: "transparent",
    black: "#000",
    white: "#fff",
    brand: {
      50: "#fef0f0",
      100: "#fbd3d1",
      200: "#f8b5b3",
      300: "#f59794",
      400: "#f27a75",
      500: "#f06b66",
      600: "#d8605c",
      700: "#c05652",
      800: "#a84b47",
      900: "#90403d",
    },
    border: "#e3e7e9",
    bg: "#f5f8fa",
    secBg: "#DEE6F5",
  },
});
