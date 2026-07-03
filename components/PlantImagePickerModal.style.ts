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

  yellowShape: {
    position: "absolute",
    top: -hp(13),
    left: -wp(18),
    width: wp(136),
    height: hp(30),
    backgroundColor: colors.accent,
    borderBottomLeftRadius: moderateScale(150),
    borderBottomRightRadius: moderateScale(150),
  },

  closeButton: {
    position: "absolute",
    top: hp(5.5),
    right: wp(6),
    zIndex: 10,
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(21),
    backgroundColor: colors.textLightest,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    paddingTop: hp(9),
    alignItems: "center",
    zIndex: 2,
  },

  logo: {
    width: moderateScale(60),
    height: moderateScale(60),
    marginBottom: hp(6),
    marginTop: hp(-3),
  },

  title: {
    fontFamily: Fonts.heading,
    fontSize: fontScale(37),
    lineHeight: fontScale(47),
    color: colors.textLightest,
    textAlign: "center",
    paddingHorizontal: wp(5),

    textShadowColor: "rgba(20, 44, 25, 0.45)",
    textShadowOffset: { width: 0, height: 5 },
    textShadowRadius: 2,
  },

  panel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: hp(50),
    backgroundColor: colors.forestGreen,
    borderTopLeftRadius: moderateScale(60),
    borderTopRightRadius: moderateScale(60),
    paddingHorizontal: wp(6.5),
    paddingBottom: hp(9),
  },

  dragLine: {
    width: wp(60),
    height: moderateScale(4),
    borderRadius: moderateScale(4),
    backgroundColor: colors.textLightest,
    alignSelf: "center",
    marginBottom: hp(5),
    marginTop: hp(4),
  },

  primaryCard: {
    width: "100%",
    minHeight: hp(18),
    borderRadius: moderateScale(22),
    backgroundColor: colors.mediumgreen,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(5.5),

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 7,
  },

  lightIconCircle: {
    width: moderateScale(70),
    height: moderateScale(70),
    borderRadius: moderateScale(41),
    backgroundColor: colors.lightestGreen,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(1.8),
    marginTop: hp(2),
  },

  primaryText: {
    fontFamily: Fonts.paragraph,
    fontSize: fontScale(31),
    color: colors.textLightest,
    textAlign: "center",

    textShadowColor: "rgba(20, 44, 25, 0.65)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 2,
  },

  secondaryCard: {
    width: "100%",
    minHeight: hp(18),
    borderRadius: moderateScale(22),
    backgroundColor: colors.darkest,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 7,
  },

  darkIconCircle: {
    width: moderateScale(70),
    height: moderateScale(70),
    borderRadius: moderateScale(41),
    backgroundColor: colors.mediumgreen,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(1.8),
    marginTop: hp(2),
  },

  secondaryText: {
    fontFamily: Fonts.paragraph,
    fontSize: fontScale(28),
    color: colors.textLightest,
    textAlign: "center",

    textShadowColor: "rgba(20, 44, 25, 0.65)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 2,
  },
});
