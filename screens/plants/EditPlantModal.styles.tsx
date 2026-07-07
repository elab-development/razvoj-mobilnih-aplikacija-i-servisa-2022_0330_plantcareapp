import { StyleSheet } from "react-native";

import { Colors } from "@/constants/theme";
import { hp, moderateScale, wp } from "@/utils/responsive";

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
    paddingBottom: hp(12),
  },

  closeButton: {
    position: "absolute",
    top: hp(5),
    right: wp(6),
    zIndex: 5,
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(21),
    backgroundColor: "rgba(20, 44, 25, 0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: moderateScale(58),
    height: moderateScale(58),
    alignSelf: "center",
    marginBottom: hp(1.5),
  },
});
