import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { Fonts } from '@/constants/fonts';

const colors = Colors.light;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 90,
  },

  logo: {
    width: 60,
    height: 60,
    marginBottom: 20,
  },

  title: {
    fontFamily: Fonts.heading,
    fontSize: 48,
    textAlign: 'center',
    color: colors.textLightest,
    textShadowColor: 'rgba(20, 44, 25, 0.25)',
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 2,
    marginBottom: 8,
  },

  imageWrapper: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -4,
  },

  circle: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 130,
    backgroundColor: colors.accent,
    bottom: 0,
  },

  plantImage: {
    width: 315,
    height: 330,
  
  },

  textCard: {
    width: '100%',
    minHeight: 138,
    backgroundColor: colors.textLightest,
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -90,
    shadowColor: colors.textDarkest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 4,
    elevation: 5,
  },

  description: {
    fontFamily: Fonts.paragraph,
    fontSize: 20,
    lineHeight: 28,
    color: colors.textDarkest,
    textAlign: 'center',
  },

  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 28,
    marginBottom: 40,
  },

  dot: {
    width: 34,
    height: 9,
    borderRadius: 999,
    backgroundColor: colors.accent,
  },

  activeDot: {
    width: 67,
    backgroundColor: colors.textLightest,
  },
});