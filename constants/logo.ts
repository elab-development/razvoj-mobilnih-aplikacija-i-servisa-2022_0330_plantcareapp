import { hp, moderateScale } from "@/utils/responsive";
import { ImageStyle } from "react-native";

export const LogoStyle: ImageStyle = {
  width: moderateScale(50),
  height: moderateScale(50),
  alignSelf: "center",
  marginTop: hp(5),
  marginBottom: hp(4),
};
