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

  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },

  topShape: {
    position: "absolute",
    top: -hp(17),
    left: -wp(12),
    width: wp(125),
    height: hp(30),
    backgroundColor: colors.accent,
  },
  listContent: {
    paddingHorizontal: wp(5),
    paddingTop: hp(6),
    paddingBottom: hp(17),
    zIndex: 1,
  },

  logo: {
    ...LogoStyle,
  },
  welcomeText: {
    ...Typography.screenTitle,
    color: colors.textLightest,
    textAlign: "center",
    marginBottom: hp(3),
  },

  addSensorButton: {
    width: "100%",
    height: hp(11.5),
    borderWidth: 2,
    borderColor: colors.textLightest,
    borderRadius: moderateScale(13),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(2.5),

    shadowColor: colors.textDarkest,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.22,
    shadowRadius: 4,
  },

  addSensorText: {
    fontFamily: Fonts.heading,
    fontSize: fontScale(14),
    color: colors.textLightest,
    marginTop: -hp(0.7),
    includeFontPadding: false,
  },

  sectionTitle: {
    ...Typography.sectionTitle,
    color: colors.textDarkest,
    marginBottom: hp(1.5),
    includeFontPadding: false,
  },

  searchBox: {
    width: "100%",
    height: hp(7),
    borderWidth: 2,
    borderColor: colors.textLightest,
    borderRadius: moderateScale(15),
    paddingHorizontal: moderateScale(18),
    marginBottom: hp(3.5),

    flexDirection: "row",
    alignItems: "center",
  },

  searchInput: {
    flex: 1,
    height: "100%",
    fontFamily: Fonts.paragraph,
    fontSize: fontScale(24),
    color: colors.textLightest,
    paddingVertical: 0,
    includeFontPadding: false,
  },

  card: {
    width: "100%",
    minHeight: hp(7),
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: moderateScale(15),
    paddingHorizontal: moderateScale(16),
    paddingVertical: 0,
    marginBottom: hp(3),

    backgroundColor: colors.plantCardColor,
    textAlignVertical: "center",
    includeFontPadding: false,

    shadowColor: colors.textDarkest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 3,
  },

  iconArea: {
    width: moderateScale(125),
    height: moderateScale(140),
    marginRight: wp(3),
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  iconCircle: {
    position: "absolute",
    width: moderateScale(108),
    height: moderateScale(108),
    borderRadius: moderateScale(54),
    backgroundColor: colors.textLightest,
    left: moderateScale(5),
    top: moderateScale(18),
  },

  iconShadowBox: {
    position: "absolute",
    width: moderateScale(132),
    height: moderateScale(132),
    left: moderateScale(-4),
    top: moderateScale(0),

    shadowColor: colors.textDarkest,
    shadowOffset: {
      width: moderateScale(10),
      height: moderateScale(5),
    },
    shadowOpacity: 0.35,
    shadowRadius: moderateScale(5),
    elevation: 8,

    justifyContent: "center",
    alignItems: "center",
  },

  cardContent: {
    flex: 1,
    marginTop: hp(2),
  },

  cardTitle: {
    ...Typography.cardTitle,
    color: colors.accent,
    textAlign: "right",

    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 1,
    includeFontPadding: false,
  },

  titleLine: {
    width: "100%",
    height: 2,
    backgroundColor: colors.accent,
    marginTop: hp(0.4),
    marginBottom: hp(1.5),
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(1),
  },

  infoLabel: {
    fontFamily: Fonts.heading,
    fontSize: fontScale(13),
    color: colors.textLightest,
    includeFontPadding: false,
  },

  infoValue: {
    maxWidth: wp(27),
    fontFamily: Fonts.heading,
    fontSize: fontScale(13),
    color: colors.accent,
    textAlign: "right",

    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 1,
    includeFontPadding: false,
  },

  statusGood: {
    color: colors.accent,
  },

  statusWarning: {
    color: colors.textLightest,
  },

  statusBad: {
    color: "#FFB3A7",
  },

  emptyBox: {
    marginTop: hp(5),
    alignItems: "center",
  },

  emptyText: {
    fontFamily: Fonts.heading,
    fontSize: fontScale(22),
    color: colors.textDarkest,
    textAlign: "center",
    includeFontPadding: false,
  },

  emptySubtext: {
    fontFamily: Fonts.paragraph,
    fontSize: fontScale(16),
    color: colors.textDarkest,
    textAlign: "center",
    marginTop: hp(1),
    opacity: 0.8,
    includeFontPadding: false,
  },
});
