/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

const plantPalette = {
  darkestGreen: "#142C19",
  forestGreen: "#2D5128",
  mediumGreen: "#6B8A47",
  lightGreen: "#8DA750",
  yellow: "#FFD96A",
  lightestYellow: "#E4EB9C",
  white: "#F4F1E9",
  pureWhite: "#FFFFFF",
};

export const Colors = {
  light: {
    textDarkest: plantPalette.darkestGreen,
    textLightest: plantPalette.lightestYellow,
    textPlantCard: plantPalette.yellow,
    background: plantPalette.lightGreen,
    plantCardColor: plantPalette.forestGreen,
    poppupCardColor: plantPalette.forestGreen,

    darkest: plantPalette.darkestGreen,
    accent: plantPalette.yellow,
    mediumgreen: plantPalette.mediumGreen,
    forestGreen: plantPalette.forestGreen,
    white: plantPalette.white,
    lightestGreen: plantPalette.lightGreen,

    border: plantPalette.lightestYellow,
  },
  dark: {
    text: plantPalette.white,
    background: plantPalette.darkestGreen,
    tint: plantPalette.yellow,
    icon: plantPalette.lightestYellow,
    tabIconDefault: plantPalette.lightGreen,
    tabIconSelected: plantPalette.yellow,

    primary: plantPalette.forestGreen,
    primaryDark: plantPalette.darkestGreen,
    secondary: plantPalette.lightGreen,
    accent: plantPalette.yellow,
    card: plantPalette.forestGreen,
    border: plantPalette.mediumGreen,
    mutedText: plantPalette.lightestYellow,
  },
};
