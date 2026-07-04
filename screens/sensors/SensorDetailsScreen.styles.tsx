import { StyleSheet } from "react-native";

import { Fonts } from "@/constants/fonts";
import { LogoStyle } from "@/constants/logo";
import { Colors } from "@/constants/theme";
import { fontScale, hp, moderateScale, wp } from "@/utils/responsive";

const colors = Colors.light as any;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    position: "relative",
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
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
    fontFamily: Fonts.heading,
    fontSize: fontScale(34),
    lineHeight: fontScale(42),
    color: colors.textLightest,
    textAlign: "center",
    marginBottom: hp(3),

    textShadowColor: "rgba(20, 44, 25, 0.45)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 2,
    includeFontPadding: false,
  },

  statusCard: {
    width: "100%",
    minHeight: hp(11),
    backgroundColor: colors.primary,
    borderRadius: moderateScale(16),
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.8),
    marginBottom: hp(2.5),

    flexDirection: "row",
    alignItems: "center",
  },

  sensorIconCircle: {
    width: moderateScale(68),
    height: moderateScale(68),
    borderRadius: moderateScale(34),
    backgroundColor: colors.textLightest,
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(4),
  },

  statusTextBox: {
    flex: 1,
  },

  statusLabel: {
    fontFamily: Fonts.paragraph,
    fontSize: fontScale(15),
    lineHeight: fontScale(20),
    color: colors.textLightest,
    includeFontPadding: false,
  },

  statusValue: {
    fontFamily: Fonts.heading,
    fontSize: fontScale(24),
    lineHeight: fontScale(31),
    color: colors.accent,
    includeFontPadding: false,
  },

  readingCard: {
    width: "100%",
    backgroundColor: colors.primary,
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    marginBottom: hp(3),
  },

  readingTitle: {
    fontFamily: Fonts.heading,
    fontSize: fontScale(20),
    lineHeight: fontScale(27),
    color: colors.textLightest,
    textAlign: "center",
    marginBottom: hp(1.5),
    includeFontPadding: false,
  },

  readingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp(1),
  },

  readingLabel: {
    fontFamily: Fonts.paragraph,
    fontSize: fontScale(15),
    lineHeight: fontScale(20),
    color: colors.textLightest,
    includeFontPadding: false,
  },

  readingValue: {
    maxWidth: wp(40),
    fontFamily: Fonts.heading,
    fontSize: fontScale(14),
    lineHeight: fontScale(20),
    color: colors.accent,
    textAlign: "right",
    includeFontPadding: false,
  },

  label: {
    fontFamily: Fonts.paragraph,
    fontSize: fontScale(20),
    lineHeight: fontScale(26),
    color: colors.textLightest,
    marginBottom: hp(0.8),
    marginLeft: wp(3),
    includeFontPadding: false,
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
    lineHeight: fontScale(24),
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

  selectedInfoBox: {
    width: "100%",
    backgroundColor: colors.primary,
    borderRadius: moderateScale(15),
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(5),
    marginBottom: hp(3),
  },

  selectedInfoText: {
    fontFamily: Fonts.paragraph,
    fontSize: fontScale(14),
    lineHeight: fontScale(20),
    color: colors.textLightest,
    textAlign: "center",
    includeFontPadding: false,
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

  emptyPlantsBox: {
    width: "100%",
    minHeight: hp(10),
    borderWidth: 2,
    borderColor: colors.textLightest,
    borderRadius: moderateScale(15),
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(6),
    marginBottom: hp(3),
  },

  emptyPlantsText: {
    fontFamily: Fonts.heading,
    fontSize: fontScale(17),
    lineHeight: fontScale(23),
    color: colors.textLightest,
    textAlign: "center",
    includeFontPadding: false,
  },

  confirmButton: {
    alignSelf: "center",
    width: wp(58),
    height: hp(6.5),
    marginTop: hp(1),
  },

  confirmButtonText: {
    fontSize: fontScale(18),
    lineHeight: fontScale(24),
    color: colors.textLightest,
  },

  deleteButton: {
    alignSelf: "center",
    width: wp(48),
    height: hp(5.5),
    marginTop: hp(2),
    borderRadius: moderateScale(14),
    borderColor: "#FFB3A7",
  },

  deleteButtonText: {
    fontSize: fontScale(17),
    lineHeight: fontScale(22),
    color: "#FFB3A7",
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
