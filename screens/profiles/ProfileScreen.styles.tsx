import { Fonts } from "@/constants/fonts";
import { Colors } from "@/constants/theme";
import { fontScale, hp, moderateScale, wp } from "@/utils/responsive";
import { StyleSheet } from "react-native";

const colors = Colors.light;

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

  topShape: {
    position: "absolute",
    top: -hp(17),
    left: -wp(12),
    width: wp(125),
    height: hp(37),
    backgroundColor: colors.accent,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: wp(9),
    paddingTop: hp(6),
    paddingBottom: hp(2),
  },

  logo: {
    width: moderateScale(50),
    height: moderateScale(50),
    alignSelf: "center",
    marginTop: hp(6),
    marginBottom: hp(5),
  },

  label: {
    fontFamily: Fonts.paragraph,
    fontSize: fontScale(18),
    color: colors.textLightest,
    marginLeft: moderateScale(4),
    marginBottom: hp(0.5),
  },

  inputWithIcon: {
    position: "relative",
  },

  editIcon: {
    position: "absolute",
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },

  biometricCard: {
    width: "100%",
    minHeight: 70,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 18,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  biometricTitle: {
    fontFamily: Fonts.heading,
    fontSize: fontScale(23),
    color: colors.textLightest,
    marginBottom: 2,
  },

  saveButton: {
    alignSelf: "center",
    width: wp(65),
    height: hp(6.8),
    marginTop: hp(1),
    backgroundColor: colors.mediumgreen,
  },

  saveButtonText: {
    fontSize: fontScale(22),
    lineHeight: fontScale(28),
    color: colors.textLightest,
  },

  cancelButton: {
    alignSelf: "center",
    width: wp(45),
    height: hp(5.2),
    marginTop: hp(1.8),
    borderRadius: moderateScale(16),
  },

  cancelButtonText: {
    fontSize: fontScale(16),
    lineHeight: fontScale(22),
    color: colors.textLightest,
  },

  logoutButton: {
    alignSelf: "center",
    width: wp(35),
    height: hp(5),
    marginBottom: hp(1.5),
    borderRadius: moderateScale(16),
  },

  logoutButtonText: {
    fontSize: fontScale(17),
    color: colors.textLightest,
  },

  loader: {
    marginTop: 8,
    marginBottom: 8,
  },
  readonlyBox: {
    width: "100%",
    height: hp(6.8),
    borderWidth: 2,
    borderColor: colors.textLightest,
    borderRadius: moderateScale(14),
    paddingHorizontal: moderateScale(18),
    justifyContent: "center",
    marginBottom: hp(1.5),

    backgroundColor: colors.mediumgreen,

    shadowColor: colors.textDarkest,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: moderateScale(3),
  },

  readonlyText: {
    fontFamily: Fonts.paragraph,
    fontSize: fontScale(17),
    color: colors.textLightest,
  },
  avatarWrapper: {
    width: moderateScale(95),
    height: moderateScale(95),
    alignSelf: "center",
    marginBottom: hp(2),
    position: "relative",
  },

  avatar: {
    width: moderateScale(92),
    height: moderateScale(92),
    borderRadius: moderateScale(46),
    borderWidth: 3,
    borderColor: colors.textLightest,
    backgroundColor: colors.background,
  },

  avatarEditBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(15),
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: moderateScale(2),
    borderColor: colors.background,
  },

  avatarEditText: {
    fontFamily: Fonts.heading,
    fontSize: fontScale(16),
    color: colors.textDarkest,
  },
});
