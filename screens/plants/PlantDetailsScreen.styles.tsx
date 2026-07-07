import { StyleSheet } from "react-native";

import { Colors } from "@/constants/theme";
import { Typography } from "@/constants/typography";
import { hp, moderateScale, wp } from "@/utils/responsive";

const colors = Colors.light as any;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkest,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    height: hp(3),
  },

  scrollContent: {
    paddingBottom: hp(8),
  },

  imageHeader: {
    width: "100%",
    height: hp(42),
    backgroundColor: colors.dark,
    position: "relative",
  },

  headerImage: {
    width: "100%",
    height: "100%",
  },

  backButton: {
    position: "absolute",
    top: hp(5),
    left: wp(5),
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(21),
    backgroundColor: colors.darkest,
    justifyContent: "center",
    alignItems: "center",
  },

  editTopButton: {
    position: "absolute",
    top: hp(5),
    right: wp(5),
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(21),
    backgroundColor: "rgba(20, 44, 25, 0.55)",
    justifyContent: "center",
    alignItems: "center",
  },

  contentCard: {
    marginTop: -hp(7),
    width: "100%",
    minHeight: hp(65),
    backgroundColor: colors.background,
    borderTopLeftRadius: moderateScale(32),
    borderTopRightRadius: moderateScale(32),
    paddingHorizontal: wp(5),
    paddingTop: hp(5),
    paddingBottom: hp(8),
  },

  dropIcon: {
    position: "absolute",
    top: -moderateScale(26),
    alignSelf: "center",
    width: moderateScale(52),
    height: moderateScale(52),
    borderRadius: moderateScale(26),
    backgroundColor: colors.darkest,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: colors.background,
  },

  plantTitle: {
    ...Typography.screenTitle,
    color: colors.textLightest,
    textAlign: "center",
    marginBottom: hp(0.5),
  },

  plantSubtitle: {
    ...Typography.smallCardTitle,
    color: colors.forestGreen,
    opacity: 0.45,
    textAlign: "center",
    textTransform: "lowercase",
    marginBottom: hp(2.2),
  },

  tabsContainer: {
    width: "100%",
    height: hp(5.7),
    backgroundColor: colors.white,
    borderRadius: moderateScale(16),
    flexDirection: "row",
    padding: moderateScale(5),
    marginBottom: hp(2.5),
  },

  tabButton: {
    flex: 1,
    borderRadius: moderateScale(12),
    justifyContent: "center",
    alignItems: "center",
  },

  activeTabButton: {
    backgroundColor: colors.darkest,
  },

  tabText: {
    ...Typography.buttonTextSmall,
    color: colors.darkest,
  },

  activeTabText: {
    color: colors.textLightest,
  },

  sectionCard: {
    width: "100%",
    backgroundColor: "transparent",
    borderRadius: moderateScale(18),
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },

  sectionTitle: {
    ...Typography.sectionTitle,
    color: colors.textLightest,
    marginBottom: hp(1.5),

    textShadowColor: "rgba(20, 44, 25, 0.45)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 2,
  },

  sectionDivider: {
    width: "90%",
    height: 1.5,
    backgroundColor: colors.forestGreen,
    opacity: 0.35,
    alignSelf: "center",
    marginVertical: hp(1.5),
    marginBottom: hp(3),
    marginTop: hp(2),
  },

  sectionDividerSmall: {
    width: "70%",
    height: 1.5,
    backgroundColor: colors.forestGreen,
    opacity: 0.35,
    alignSelf: "center",
    marginVertical: hp(1.5),
  },

  infoRow: {
    minHeight: hp(4.5),
    // borderBottomWidth: 1,
    // borderBottomColor: "rgba(20, 44, 25, 0.12)",
    paddingVertical: hp(0.8),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  infoLabel: {
    flex: 1,
    ...Typography.bodySmall,
    fontWeight: 900,
    color: colors.textLightest,
  },

  infoValue: {
    flex: 1.25,
    ...Typography.bodySmall,
    color: colors.accent,
    textAlign: "right",
    fontStyle: "italic",
  },

  descriptionText: {
    ...Typography.bodySmall,
    color: colors.textLightest,
    lineHeight: hp(2.6),
  },

  label: {
    ...Typography.inputLabel,
    color: colors.textLightest,
    marginBottom: hp(0.7),
    marginLeft: wp(2),
  },

  input: {
    width: "100%",
    minHeight: hp(6.5),
    borderWidth: 2,
    borderColor: colors.textLightest,
    borderRadius: moderateScale(15),
    paddingHorizontal: moderateScale(16),
    paddingVertical: 0,
    marginBottom: hp(2),

    ...Typography.inputText,
    color: colors.textDarkest,

    backgroundColor: "transparent",
    textAlignVertical: "center",
  },

  saveButton: {
    alignSelf: "center",
    width: wp(55),
    height: hp(6.3),
    marginTop: hp(1),
    borderColor: colors.primary,
  },

  saveButtonText: {
    ...Typography.buttonText,
    color: colors.textLightest,
  },

  deleteButton: {
    alignSelf: "center",
    width: wp(55),
    height: hp(5.8),
    marginTop: hp(2),
    borderRadius: moderateScale(14),
    borderColor: "#FF8F80",
  },

  deleteButtonText: {
    ...Typography.buttonTextSmall,
    color: "#FF8F80",
  },

  loader: {
    marginTop: hp(2),
    marginBottom: hp(1),
  },
});
