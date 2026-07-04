import { Fonts } from "@/constants/fonts";
import { fontScale } from "@/utils/responsive";

export const Typography = {
  screenTitleLarge: {
    fontFamily: Fonts.heading,
    fontSize: fontScale(40),
    lineHeight: fontScale(50),
    includeFontPadding: false,
  },

  screenTitle: {
    fontFamily: Fonts.heading,
    fontSize: fontScale(34),
    lineHeight: fontScale(44),
    includeFontPadding: false,

    textShadowColor: "rgba(20, 44, 25, 0.45)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 2,
  },

  sectionTitle: {
    fontFamily: Fonts.heading,
    fontSize: fontScale(26),
    lineHeight: fontScale(34),
    includeFontPadding: false,
  },

  cardTitle: {
    fontFamily: Fonts.heading,
    fontSize: fontScale(24),
    lineHeight: fontScale(31),
    includeFontPadding: false,
  },

  smallCardTitle: {
    fontFamily: Fonts.heading,
    fontSize: fontScale(18),
    lineHeight: fontScale(31),
    includeFontPadding: false,
  },

  buttonText: {
    fontFamily: Fonts.heading,
    fontSize: fontScale(18),
    lineHeight: fontScale(24),
    includeFontPadding: false,
  },

  buttonTextSmall: {
    fontFamily: Fonts.heading,
    fontSize: fontScale(15),
    lineHeight: fontScale(20),
    includeFontPadding: false,
  },

  inputLabel: {
    fontFamily: Fonts.paragraph,
    fontSize: fontScale(20),
    lineHeight: fontScale(26),
    includeFontPadding: false,
  },

  inputText: {
    fontFamily: Fonts.paragraph,
    fontSize: fontScale(18),
    lineHeight: fontScale(24),
    includeFontPadding: false,
  },

  body: {
    fontFamily: Fonts.paragraph,
    fontSize: fontScale(16),
    lineHeight: fontScale(22),
    includeFontPadding: false,
  },

  bodySmall: {
    fontFamily: Fonts.paragraph,
    fontSize: fontScale(14),
    lineHeight: fontScale(20),
    includeFontPadding: false,
  },

  helperText: {
    fontFamily: Fonts.paragraph,
    fontSize: fontScale(13),
    lineHeight: fontScale(18),
    includeFontPadding: false,
  },
};
