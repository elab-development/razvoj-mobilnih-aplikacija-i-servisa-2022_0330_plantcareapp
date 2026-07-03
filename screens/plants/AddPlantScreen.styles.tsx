import { StyleSheet } from "react-native";

import { Fonts } from "@/constants/fonts";
import { Colors } from "@/constants/theme";
import { fontScale, hp, moderateScale, wp } from "@/utils/responsive";

const colors = Colors.light;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: wp(7.5),
    paddingTop: hp(5),
    paddingBottom: hp(20),
  },

  logo: {
    width: moderateScale(50),
    height: moderateScale(50),
    alignSelf: "center",
    marginBottom: hp(1.5),
    marginTop: hp(6),
  },

  title: {
    fontFamily: Fonts.heading,
    fontSize: fontScale(34),
    lineHeight: fontScale(42),
    color: colors.textLightest,
    textAlign: "center",
    marginBottom: hp(4),

    textShadowColor: "rgba(20, 44, 25, 0.45)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 2,
  },

  label: {
    fontFamily: Fonts.paragraph,
    fontSize: fontScale(22),
    color: colors.textLightest,
    marginBottom: hp(0.8),
    marginLeft: wp(3),
  },

  input: {
    width: "100%",
    minHeight: hp(7),
    borderWidth: 2,
    borderColor: colors.textLightest,
    borderRadius: moderateScale(15),
    paddingHorizontal: moderateScale(16),
    paddingVertical: 0,
    marginBottom: hp(3),

    fontFamily: Fonts.paragraph,
    fontSize: fontScale(18),
    color: colors.textLightest,
    fontStyle: "italic",

    backgroundColor: "transparent",
    textAlignVertical: "center",
    includeFontPadding: false,

    shadowColor: colors.textDarkest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 3,
  },

  imagePicker: {
    width: wp(50),
    height: hp(25),
    borderRadius: moderateScale(15),
    backgroundColor: colors.mediumgreen,
    marginBottom: hp(3),
    overflow: "hidden",

    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",

    shadowColor: colors.textDarkest,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
  },

  plantImagePreview: {
    width: "100%",
    height: "100%",
  },

  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },

  cameraCircle: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(21),
    backgroundColor: colors.textLightest,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(1),
  },

  imagePlaceholderText: {
    fontFamily: Fonts.heading,
    fontSize: fontScale(18),
    color: colors.textLightest,
  },

  speciesRow: {
    position: "relative",
  },

  speciesInput: {
    paddingRight: moderateScale(48),
  },

  clearButton: {
    position: "absolute",
    right: moderateScale(12),
    top: hp(1.7),
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(15),
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },

  disabledInput: {
    opacity: 0.75,
  },

  smallLoader: {
    marginTop: -hp(2),
    marginBottom: hp(2),
  },

  suggestionsBox: {
    marginTop: -hp(2),
    marginBottom: hp(3),
    borderRadius: moderateScale(14),
    backgroundColor: colors.background,
    overflow: "hidden",

    shadowColor: colors.textDarkest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },

  suggestionItem: {
    paddingVertical: hp(1.4),
    paddingHorizontal: moderateScale(16),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(244, 241, 233, 0.25)",
  },

  suggestionName: {
    fontFamily: Fonts.paragraph,
    fontSize: fontScale(17),
    color: colors.textLightest,
  },

  suggestionScientific: {
    fontFamily: Fonts.paragraph,
    fontSize: fontScale(13),
    color: colors.textLightest,
    opacity: 0.8,
    marginTop: 2,
    fontStyle: "italic",
  },

  notFoundCard: {
    backgroundColor: colors.background,
    borderRadius: moderateScale(14),
    padding: moderateScale(14),
    marginTop: -hp(2),
    marginBottom: hp(3),
  },

  notFoundText: {
    fontFamily: Fonts.heading,
    fontSize: fontScale(16),
    color: colors.textLightest,
    textAlign: "center",
  },

  notFoundSubtext: {
    fontFamily: Fonts.paragraph,
    fontSize: fontScale(14),
    color: colors.textLightest,
    textAlign: "center",
    marginTop: hp(0.6),
    opacity: 0.9,
  },

  infoCard: {
    width: "100%",
    backgroundColor: colors.background,
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    marginBottom: hp(3),

    shadowColor: colors.textDarkest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 4,
  },

  infoTitle: {
    fontFamily: Fonts.heading,
    fontSize: fontScale(20),
    color: colors.textLightest,
    marginBottom: hp(1.5),
    textAlign: "center",
  },

  infoLabel: {
    fontFamily: Fonts.paragraph,
    fontSize: fontScale(14),
    color: colors.textLightest,
    opacity: 0.85,
    marginTop: hp(0.8),
  },

  infoValue: {
    fontFamily: Fonts.paragraph,
    fontSize: fontScale(15),
    color: colors.textLightest,
    marginTop: hp(0.2),
  },

  helperText: {
    fontFamily: Fonts.paragraph,
    fontSize: fontScale(13),
    color: colors.textLightest,
    opacity: 0.85,
    textAlign: "center",
    marginTop: -hp(2),
    marginBottom: hp(2),
  },

  confirmButton: {
    alignSelf: "center",
    width: wp(58),
    height: hp(6.5),
    marginTop: hp(1),
    backgroundColor: colors.mediumgreen,
    borderRadius: moderateScale(12),
  },

  confirmButtonText: {
    fontSize: fontScale(18),
    lineHeight: fontScale(24),
    color: colors.textLightest,
  },

  cancelButton: {
    alignSelf: "center",
    width: wp(40),
    height: hp(5),
    marginTop: hp(2),
    borderRadius: moderateScale(10),
  },

  cancelButtonText: {
    fontSize: fontScale(17),
    lineHeight: fontScale(22),
    color: colors.textLightest,
  },

  loader: {
    marginTop: hp(2),
  },
  dateInput: {
    width: "100%",
    minHeight: hp(7),
    borderWidth: 2,
    borderColor: colors.textLightest,
    borderRadius: moderateScale(15),
    paddingHorizontal: moderateScale(16),
    marginBottom: hp(3),

    justifyContent: "center",

    backgroundColor: "transparent",

    shadowColor: colors.textDarkest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 3,
  },

  dateText: {
    fontFamily: Fonts.paragraph,
    fontSize: fontScale(18),
    color: colors.textLightest,
    fontStyle: "italic",
  },
});
