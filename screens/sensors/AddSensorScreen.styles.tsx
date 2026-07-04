import { StyleSheet } from "react-native";

import { Fonts } from "@/constants/fonts";
import { LogoStyle } from "@/constants/logo";
import { Colors } from "@/constants/theme";
import { Typography } from "@/constants/typography";
import { fontScale, hp, moderateScale, wp } from "@/utils/responsive";

const colors = Colors.light as any;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    position: "relative",
  },

  scrollView: {
    flex: 1,
    backgroundColor: "transparent",
    zIndex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: wp(7.5),
    paddingTop: hp(5),
    paddingBottom: hp(20),
  },

  logo: {
    ...LogoStyle,
  },

  title: {
    ...Typography.screenTitle,
    color: colors.textLightest,
    textAlign: "center",
    marginTop: hp(1),
    marginBottom: hp(3),
  },

  plantSearchInput: {
    width: "100%",
    minHeight: hp(6.5),
    borderWidth: 2,
    borderColor: colors.textLightest,
    borderRadius: moderateScale(15),
    paddingHorizontal: moderateScale(16),
    paddingVertical: 0,
    marginBottom: hp(2),

    fontFamily: Fonts.paragraph,
    fontSize: fontScale(18),
    lineHeight: fontScale(24),
    color: colors.textLightest,
    fontStyle: "italic",

    backgroundColor: "transparent",
    textAlignVertical: "center",
    includeFontPadding: false,

    shadowColor: colors.textDarkest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  label: {
    ...Typography.inputLabel,
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

    ...Typography.inputText,
    color: colors.textLightest,
    fontStyle: "italic",

    backgroundColor: "transparent",
    textAlignVertical: "center",
    includeFontPadding: false,
  },

  plantsList: {
    width: "100%",
    marginBottom: hp(2.5),
  },

  plantOption: {
    width: "100%",
    minHeight: hp(8.5),
    borderWidth: 2,
    borderColor: colors.textLightest,
    borderRadius: moderateScale(15),
    paddingHorizontal: moderateScale(14),
    paddingVertical: hp(1.2),
    marginBottom: hp(1.5),

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "rgba(20, 44, 25, 0.08)",

    shadowColor: colors.textDarkest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },

  selectedPlantOption: {
    backgroundColor: colors.accent,
    borderColor: colors.textDarkest,
  },

  plantIconCircle: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(21),
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(3),
  },

  plantTextBox: {
    flex: 1,
  },

  plantName: {
    fontFamily: Fonts.heading,
    fontSize: fontScale(17),
    lineHeight: fontScale(23),
    color: colors.textLightest,
    includeFontPadding: false,
  },

  selectedPlantName: {
    color: colors.textDarkest,
  },

  plantSubtitle: {
    fontFamily: Fonts.paragraph,
    fontSize: fontScale(13),
    lineHeight: fontScale(18),
    color: colors.textLightest,
    opacity: 0.9,
    marginTop: hp(0.3),
    includeFontPadding: false,
  },

  selectedPlantSubtitle: {
    color: colors.textDarkest,
  },

  emptyPlantsBox: {
    width: "100%",
    minHeight: hp(16),
    borderWidth: 2,
    borderColor: colors.textLightest,
    borderRadius: moderateScale(15),
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(6),
    marginBottom: hp(3),

    backgroundColor: "rgba(20, 44, 25, 0.08)",
  },

  emptyPlantsText: {
    ...Typography.smallCardTitle,
    color: colors.textLightest,
    textAlign: "center",
    marginTop: hp(1),

    includeFontPadding: false,
  },

  emptyPlantsSubtext: {
    ...Typography.bodySmall,
    color: colors.textLightest,
    textAlign: "center",
    marginTop: hp(0.8),
    opacity: 0.9,
    includeFontPadding: false,
  },

  selectedInfoBox: {
    width: "100%",
    backgroundColor: colors.primary,
    borderRadius: moderateScale(15),
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(5),
    marginBottom: hp(3),
  },

  selectedInfoText: {
    ...Typography.bodySmall,
    color: colors.textLightest,
    textAlign: "center",
    includeFontPadding: false,
  },
  topShape: {
    position: "absolute",
    top: -hp(17),
    left: -wp(12),
    width: wp(125),
    height: hp(36),
    backgroundColor: colors.accent,
  },

  selectedInfoPlant: {
    fontFamily: Fonts.heading,
    fontSize: fontScale(18),
    lineHeight: fontScale(24),
    color: colors.accent,
    textAlign: "center",
    marginTop: hp(0.4),
    includeFontPadding: false,
  },

  confirmButton: {
    alignSelf: "center",
    width: wp(58),
    height: hp(6.5),
    marginTop: hp(1),
    borderRadius: moderateScale(13),
    backgroundColor: colors.mediumgreen,
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
    borderRadius: moderateScale(13),
  },

  cancelButtonText: {
    fontSize: fontScale(17),
    lineHeight: fontScale(22),
    color: colors.textLightest,
  },

  loader: {
    marginTop: hp(2),
    marginBottom: hp(2),
  },
});
