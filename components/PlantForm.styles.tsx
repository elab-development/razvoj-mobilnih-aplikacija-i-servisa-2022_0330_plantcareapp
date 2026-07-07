import { StyleSheet } from "react-native";

import { Colors } from "@/constants/theme";
import { Typography } from "@/constants/typography";
import { hp, moderateScale, wp } from "@/utils/responsive";

const colors = Colors.light as any;

export const styles = StyleSheet.create({
  form: {
    width: "100%",
  },

  title: {
    ...Typography.screenTitle,
    color: colors.textLightest,
    textAlign: "center",
    marginBottom: hp(4),
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
  },

  disabledInput: {
    width: "100%",
    minHeight: hp(7),
    borderWidth: 2,
    borderColor: colors.textLightest,
    borderRadius: moderateScale(15),
    paddingHorizontal: moderateScale(16),
    marginBottom: hp(3),

    justifyContent: "center",
    backgroundColor: "rgba(20, 44, 25, 0.18)",
  },

  disabledInputText: {
    ...Typography.inputText,
    color: colors.textLightest,
    opacity: 0.85,
  },

  helper: {
    ...Typography.helperText,
    color: colors.textLightest,
    marginBottom: hp(2),
  },

  imagePicker: {
    width: wp(50),
    height: hp(19),
    alignSelf: "center",
    borderWidth: 2,
    borderRadius: moderateScale(18),
    borderColor: "transparent",
    marginBottom: hp(3),
    overflow: "hidden",
    backgroundColor: colors.mediumgreen,
  },

  imagePreview: {
    width: "100%",
    height: "100%",
  },

  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  imagePickerText: {
    ...Typography.body,
    color: colors.textLightest,
    marginTop: hp(1),
  },

  dateInput: {
    width: "100%",
    minHeight: hp(7),
    borderWidth: 2,
    borderColor: colors.textLightest,
    borderRadius: moderateScale(15),
    paddingHorizontal: moderateScale(16),
    marginBottom: hp(3),

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: "transparent",
  },

  dateText: {
    ...Typography.inputText,
    color: colors.textLightest,
  },

  speciesResultsBox: {
    width: "100%",
    borderWidth: 2,
    borderColor: colors.textLightest,
    borderRadius: moderateScale(15),
    marginTop: -hp(2),
    marginBottom: hp(3),
    overflow: "hidden",
  },

  speciesOption: {
    paddingVertical: hp(1.2),
    paddingHorizontal: moderateScale(16),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(244, 241, 233, 0.25)",
  },

  selectedSpeciesOption: {
    backgroundColor: colors.accent,
  },

  speciesName: {
    ...Typography.body,
    color: colors.textLightest,
  },

  selectedSpeciesName: {
    color: colors.textDarkest,
  },

  speciesSubtitle: {
    ...Typography.helperText,
    color: colors.textLightest,
    opacity: 0.8,
  },

  selectedSpeciesSubtitle: {
    color: colors.textDarkest,
  },

  speciesInfoBox: {
    width: "100%",
    backgroundColor: colors.primary,
    borderRadius: moderateScale(15),
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(5),
    marginBottom: hp(3),
  },

  speciesInfoTitle: {
    ...Typography.smallCardTitle,
    color: colors.accent,
    textAlign: "center",
  },

  speciesInfoSubtitle: {
    ...Typography.helperText,
    color: colors.textLightest,
    textAlign: "center",
    marginTop: hp(0.3),
  },

  speciesInfoText: {
    ...Typography.bodySmall,
    color: colors.textLightest,
    textAlign: "center",
    marginTop: hp(0.8),
  },

  submitButton: {
    alignSelf: "center",
    width: wp(58),
    height: hp(6.5),
    marginTop: hp(1),
    borderRadius: moderateScale(15),
    backgroundColor: colors.mediumgreen,
  },

  submitButtonText: {
    ...Typography.buttonText,
    color: colors.textLightest,
  },

  cancelButton: {
    alignSelf: "center",
    width: wp(42),
    height: hp(5.2),
    marginTop: hp(2),
    borderRadius: moderateScale(13),
  },

  cancelButtonText: {
    ...Typography.buttonTextSmall,
    color: colors.textLightest,
  },

  loader: {
    marginTop: hp(2),
    marginBottom: hp(2),
  },
});
