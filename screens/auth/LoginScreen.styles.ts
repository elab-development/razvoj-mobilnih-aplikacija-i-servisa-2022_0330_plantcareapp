import { StyleSheet } from "react-native";
import { Colors } from "@/constants/theme";
import { Fonts } from "@/constants/fonts";

const colors = Colors.light;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 33,
    paddingTop: 85,
    paddingBottom: 80,
  },

  logo: {
    width: 86,
    height: 86,
    marginBottom: 34,
  },

  title: {
    fontFamily: Fonts.heading,
    fontSize: 35,
    color: colors.textLightest,
    textAlign: "center",
    marginBottom: 54,

    textShadowColor: "rgba(20, 44, 25, 0.28)",
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 2,
  },

  form: {
    width: "100%",
    gap: 20,
    marginBottom: 50,
  },

  button: {
    width: 255,
    height: 58,
  },

  loader: {
    marginTop: 12,
  },

  buttonText: {
    fontSize: 15,
  },
  registerLinkWrapper: {
    marginTop: 5,
    marginBottom: 30,
  },
  registerText: {
    fontFamily: Fonts.paragraph,
    fontSize: 16,
    color: colors.textLightest,
    textAlign: "center",
  },

  registerTextBold: {
    fontFamily: Fonts.paragraph,
    fontWeight: "700",
    color: colors.darkest,
  },
});
