import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { Fonts } from '@/constants/fonts';

const colors = Colors.light;

export const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 55,
    borderWidth: 2,
    borderColor: colors.textLightest,
    borderRadius: 14,

    paddingHorizontal: 18,
    paddingVertical: 0,

    fontFamily: Fonts.paragraph,
    fontSize: 18,
    color: colors.textLightest,
    alignItems: 'center',

    textAlignVertical: 'center',
    includeFontPadding: false,

    shadowColor: colors.textDarkest,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
});