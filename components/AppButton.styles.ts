import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { Fonts } from '@/constants/fonts';

const colors = Colors.light;

export const styles = StyleSheet.create({
  button: {
  width: 230,
  height: 60,
  borderRadius: 20,
  backgroundColor: colors.mediumgreen,
  borderWidth: 2,
  borderColor: colors.textLightest,
  justifyContent: 'center',
  alignItems: 'center',

  shadowColor: colors.textDarkest,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 2,
},

buttonText: {
  fontFamily: Fonts.heading,
  fontSize: 26,
  lineHeight: 34,
  color: colors.textLightest,
  textAlign: 'center',
  includeFontPadding: false,
},

 outlineButton: {
    backgroundColor: 'transparent',
    borderColor: colors.textLightest,
  },

  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});