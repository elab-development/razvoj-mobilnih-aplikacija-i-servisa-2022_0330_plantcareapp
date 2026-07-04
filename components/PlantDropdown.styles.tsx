import { StyleSheet } from "react-native";

import { Fonts } from "@/constants/fonts";
import { Colors } from "@/constants/theme";
import { Typography } from "@/constants/typography";
import { fontScale, hp, moderateScale, wp } from "@/utils/responsive";

const colors = Colors.light as any;

export const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginBottom: hp(3),
  },

  dropdownButton: {
    width: "100%",
    minHeight: hp(7),
    borderWidth: 2,
    borderColor: colors.textLightest,
    borderRadius: moderateScale(15),
    paddingHorizontal: moderateScale(16),

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: "transparent",
  },

  dropdownText: {
    flex: 1,
    ...Typography.inputText,
    color: colors.textLightest,
    includeFontPadding: false,
  },

  placeholderText: {
    fontStyle: "italic",
    opacity: 0.85,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    paddingHorizontal: wp(6),
  },

  modalBox: {
    width: "100%",
    maxHeight: hp(65),
    backgroundColor: colors.background,
    borderRadius: moderateScale(18),
    padding: moderateScale(18),
  },

  modalTitle: {
    ...Typography.sectionTitle,
    color: colors.textLightest,
    textAlign: "center",
    marginBottom: hp(2),
    includeFontPadding: false,
  },

  searchInput: {
    width: "100%",
    height: hp(6.5),
    borderWidth: 1.5,
    borderColor: "transparent",
    borderRadius: moderateScale(7),
    paddingHorizontal: moderateScale(14),
    marginBottom: hp(1.5),

    ...Typography.inputText,
    color: colors.textDarkest,
    backgroundColor: "#FFFFFF",
    includeFontPadding: false,
  },

  optionsList: {
    maxHeight: hp(42),
  },

  option: {
    minHeight: hp(7),
    borderBottomWidth: 1,
    borderBottomColor: colors.textLightest,
    paddingVertical: hp(1),
    paddingHorizontal: wp(1),

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectedOption: {
    backgroundColor: colors.textLightest,
    paddingHorizontal: wp(3),
    borderBottomWidth: 0,
  },

  optionTextBox: {
    flex: 1,
    paddingRight: wp(3),
  },

  optionName: {
    ...Typography.inputText,
    color: colors.textDarkest,
    includeFontPadding: false,
  },

  optionSubtitle: {
    fontFamily: Fonts.paragraph,
    fontSize: fontScale(13),
    lineHeight: fontScale(18),
    color: colors.textDarkest,
    opacity: 0.7,
    marginTop: hp(0.3),
    includeFontPadding: false,
  },

  emptyText: {
    fontFamily: Fonts.paragraph,
    fontSize: fontScale(16),
    color: colors.textDarkest,
    textAlign: "center",
    paddingVertical: hp(4),
    includeFontPadding: false,
  },
});
