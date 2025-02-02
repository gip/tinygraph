"use client";

import { createTheme } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "violet",
  colors: {
    violet: [
      "#F3F0FF",
      "#E5DBFF",
      "#D0BFFF",
      "#B197FC",
      "#9775FA",
      "#845EF7",
      "#7048E8",
      "#6741D9",
      "#5F3DC4",
      "#5235AB",
    ],
    brand: [
      "#F4F1FF",
      "#E7E1FF",
      "#D1C4FF",
      "#B5A1FF",
      "#967CFF",
      "#7E5FFF",
      "#684EE2",
      "#5B43C7",
      "#4E39AB",
      "#42318F",
    ],
  },
  components: {
    Button: {
      defaultProps: {
        color: "brand",
      },
    },
    Badge: {
      defaultProps: {
        color: "brand",
        variant: "light",
      },
    },
    Card: {
      defaultProps: {
        radius: "md",
      },
    },
  },
  other: {
    runningIndicatorBg: "#684EE2",
  },
});
