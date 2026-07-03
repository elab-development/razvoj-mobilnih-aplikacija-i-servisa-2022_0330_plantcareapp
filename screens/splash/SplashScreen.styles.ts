import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { Fonts } from '@/constants/fonts';

const colors = Colors.light;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    alignItems: 'center',
    marginTop: 30,
  },

  logo: {
    width:80,
  height:80,
  marginBottom: 20,
  },

  title: {
    fontFamily: Fonts.heading,
    fontSize: 75,
    color: colors.textLightest,
    marginBottom: 90,
    textShadowOffset: {width:2, height:2},
  },

  progressTrack: {
    width: 180,
    height: 10,
    backgroundColor: colors.accent,
    borderRadius: 999,
    overflow: 'hidden',
  },

  progressFill: {
    width: 100,
    height: '100%',
    backgroundColor: colors.darkest,
    borderRadius: 999,
  },
});