import { StyleSheet } from "react-native";

import { Fonts } from "@/constants/fonts";
import { Colors } from "@/constants/theme";
import { fontScale, hp, moderateScale, wp } from "@/utils/responsive";

const colors = Colors.light as any;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },

  listContent: {
    paddingHorizontal: wp(5),
    paddingTop: hp(6),
    paddingBottom: hp(17),
  },

  logo: {
    width: moderateScale(50),
    height: moderateScale(50),
    alignSelf: "center",
    marginBottom: hp(1.5),
    marginTop: hp(5),
  },

  welcomeText: {
    fontFamily: Fonts.heading,
    fontSize: fontScale(25),
    lineHeight: fontScale(34),
    color: colors.textDarkest,
    marginBottom: hp(2.2),
    marginTop: hp(1.2),

    textShadowColor: colors.mediumgreen,
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 1,
  },

  addPlantButton: {
    width: "100%",
    height: hp(11.5),
    borderWidth: 2,
    borderColor: colors.textLightest,
    borderRadius: moderateScale(13),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(2.5),
  },

  addPlantText: {
    fontFamily: Fonts.heading,
    fontSize: fontScale(14),
    color: colors.textLightest,
    marginTop: -hp(0.7),

    textShadowColor: colors.mediumgreen,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 1,
  },

  sectionTitle: {
    fontFamily: Fonts.heading,
    fontSize: fontScale(22),
    lineHeight: fontScale(31),
    color: colors.textDarkest,
    marginBottom: hp(1.5),
    marginTop: hp(2.5),
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
    fontSize: fontScale(20),
    color: colors.textLightest,
    paddingVertical: 0,
    includeFontPadding: false,
  },

  card: {
    width: "100%",
    minHeight: hp(21),
    backgroundColor: colors.plantCardColor ?? colors.primary,
    borderRadius: moderateScale(14),
    marginBottom: hp(3.2),
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),

    flexDirection: "row",
    alignItems: "center",

    shadowColor: colors.textDarkest,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },

  imageCircle: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(59),
    backgroundColor: colors.textLightest,
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(4),
  },

  plantImage: {
    width: moderateScale(140),
    height: moderateScale(140),
    zIndex: 2,
    shadowColor: "#0000",
    shadowOffset: { width: 0, height: 6 },
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontFamily: Fonts.heading,
    fontSize: fontScale(22),
    lineHeight: fontScale(34),
    color: colors.accent,
    textAlign: "right",

    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 1,
  },

  titleLine: {
    width: "100%",
    height: 2,
    backgroundColor: colors.accent,
    marginTop: hp(0.4),
    marginBottom: hp(1.6),
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(1.2),
  },

  infoLabel: {
    fontFamily: Fonts.heading,
    fontSize: fontScale(14),
    color: colors.textLightest,
  },

  infoValue: {
    maxWidth: wp(24),
    fontFamily: Fonts.heading,
    fontSize: fontScale(14),
    color: colors.accent,
    textAlign: "right",

    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 1,
  },

  emptyBox: {
    marginTop: hp(5),
    alignItems: "center",
  },

  emptyText: {
    fontFamily: Fonts.heading,
    fontSize: fontScale(22),
    color: colors.mediumgreen,
    textAlign: "center",
  },

  emptySubtext: {
    fontFamily: Fonts.paragraph,
    fontSize: fontScale(15),
    color: colors.mediumgreen,
    textAlign: "center",
    marginTop: hp(1),
    opacity: 0.8,
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 0.5 },
    textShadowRadius: 1,
  },
});
